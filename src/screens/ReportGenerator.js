import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { getLivestockList, getUserProfile } from '../services/api';
import moment from 'moment';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const ReportGenerator = ({ route, navigation }) => {
  const [timeframe, setTimeframe] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [livestock, setLivestock] = useState([]);
  const [breedDistribution, setBreedDistribution] = useState({});

  useEffect(() => {
    fetchUserProfile();
    fetchLivestock();
  }, []);

  useEffect(() => {
    if (livestock.length > 0) {
      calculateBreedDistribution(livestock);
    }
  }, [livestock]);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchLivestock = async () => {
    try {
      const response = await getLivestockList();
      setLivestock(response.data.results);
    } catch (error) {
      console.error('Error fetching livestock:', error);
    }
  };

  const calculateBreedDistribution = (livestockData) => {
    const distribution = {};
    livestockData.forEach(animal => {
      distribution[animal.breed] = (distribution[animal.breed] || 0) + 1;
    });
    setBreedDistribution(distribution);
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const filteredLivestock = filterLivestockByTimeframe(livestock, timeframe);
      const htmlContent = await generateReportHTML(filteredLivestock, timeframe, userProfile, breedDistribution);

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri);
      } else {
        const pdfName = `GreenFarm_Livestock_Report_${moment().format('YYYY-MM-DD')}.pdf`;
        const pdfDest = `${FileSystem.documentDirectory}${pdfName}`;
        await FileSystem.moveAsync({
          from: uri,
          to: pdfDest,
        });
        await Sharing.shareAsync(pdfDest);
      }

      console.log('PDF report generated and saved');
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLivestockByTimeframe = (livestock, timeframe) => {
    const now = moment();
    return livestock.filter(animal => {
      const createdDate = moment(animal.created_at);
      switch (timeframe) {
        case 'week':
          return createdDate.isSame(now, 'week');
        case 'month':
          return createdDate.isSame(now, 'month');
        case 'year':
          return createdDate.isSame(now, 'year');
        default:
          return true;
      }
    });
  };

  const generateReportHTML = async (livestock, timeframe, userProfile, breedDistribution) => {
    const title = `Livestock Insights`;
    const dateRange = getDateRangeForTimeframe(timeframe);
    const logoBase64 = await getLogoBase64();
    const placeholder = await getPlaceholder();
    const livestockStats = calculateLivestockStats(livestock);

    const pageBreak = '<div style="page-break-after: always;"></div>';

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>GreenFarm Livestock Report</title>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
            
            body {
              font-family: 'Roboto', sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 40px;
              background-color: #ffffff;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
              flex: 1;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #4CAF50;
              padding-bottom: 20px;
            }
            .logo {
              width: 120px;
              height: auto;
            }
            .report-info {
              text-align: right;
            }
            .report-title {
              font-size: 36px;
              font-weight: 700;
              color: #2E7D32;
              margin: 0;
            }
            .date-range {
              font-size: 18px;
              color: #666;
            }
            .section {
              margin-top: 40px;
            }
            .section-title {
              font-size: 24px;
              color: #2E7D32;
              border-bottom: 2px solid #2E7D32;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .farm-info {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
            }
            .info-column {
              width: 48%;
            }
            .info-item {
              margin-bottom: 15px;
            }
            .info-label {
              font-weight: bold;
              color: #2E7D32;
              display: block;
            }
            .info-value {
              display: block;
            }
            .stats-container {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
            }
            .stat-card {
              background-color: #f0f8ff;
              border-radius: 10px;
              padding: 20px;
              width: 30%;
              text-align: center;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              margin-bottom: 20px;
            }
            .stat-value {
              font-size: 36px;
              font-weight: bold;
              color: #2E7D32;
              margin-bottom: 10px;
            }
            .stat-label {
              font-size: 16px;
              color: #666;
            }
            .chart-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
            }
            .livestock-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-top: 20px;
            }
            .livestock-card {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .livestock-photo {
              width: 100%;
              height: 150px;
              object-fit: cover;
              border-radius: 8px;
              margin-bottom: 10px;
            }
            .livestock-name {
              font-size: 18px;
              font-weight: bold;
              color: #2E7D32;
              margin-bottom: 5px;
            }
            .livestock-info {
              font-size: 14px;
              color: #666;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #e0e0e0;
              padding-top: 20px;
              margin-top: auto;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <header class="header">
              <img src="data:image/png;base64,${logoBase64}" alt="GreenFarm Logo" class="logo">
              <div class="report-info">
                <h1 class="report-title">${title}</h1>
                <p class="date-range">${dateRange}</p>
              </div>
            </header>

            <section class="section">
              <h2 class="section-title">Farm Overview</h2>
              <div class="farm-info">
                <div class="info-column">
                  <div class="info-item">
                    <span class="info-label">Farm Name:</span>
                    <span class="info-value">${userProfile?.farm_name || 'Not provided'}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Owner:</span>
                    <span class="info-value">${userProfile?.first_name || 'Not provided'} ${userProfile?.last_name || ''}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${userProfile?.email || 'Not provided'}</span>
                  </div>
                </div>
                <div class="info-column">
                  <div class="info-item">
                    <span class="info-label">Address:</span>
                    <span class="info-value">${userProfile?.address || 'Not provided'}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">City:</span>
                    <span class="info-value">${userProfile?.city || 'Not provided'}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">State/Province:</span>
                    <span class="info-value">${userProfile?.state_province || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </section>


            <section class="section">
              <h2 class="section-title">Livestock Statistics</h2>
              <div class="stats-container">
                ${Object.entries(livestockStats).map(([type, count]) => `
                  <div class="stat-card">
                    <div class="stat-value">${count}</div>
                    <div class="stat-label">${type}</div>
                  </div>
                `).join('')}
              </div>
            </section>


            ${pageBreak}

            <section class="section">
              <h2 class="section-title">Detailed Livestock Inventory</h2>
              ${generateLivestockGrid(livestock, placeholder)}
            </section>
          </div>

          <footer class="footer">
            <p>Generated by GreenFarm App on ${moment().format('MMMM D, YYYY [at] HH:mm:ss')}</p>
            <p>© ${new Date().getFullYear()} GreenFarm. All rights reserved.</p>
          </footer>

          <script>
            const breedData = ${JSON.stringify(breedDistribution)};
            const ctx = document.getElementById('breedChart').getContext('2d');
            new Chart(ctx, {
              type: 'pie',
              data: {
                labels: Object.keys(breedData),
                datasets: [{
                  data: Object.values(breedData),
                  backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
                  ]
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  title: {
                    display: true,
                    text: 'Breed Distribution'
                  }
                }
              }
            });
          </script>
        </body>
      </html>
    `;
  };

  const generateLivestockGrid = (livestock, placeholder) => {
    let html = '';
    for (let i = 0; i < livestock.length; i += 4) {
      html += '<div class="livestock-grid">';
      for (let j = i; j < i + 4 && j < livestock.length; j++) {
        const animal = livestock[j];
        html += `
          <div class="livestock-card">
            <img src="${animal.photo || `data:image/png;base64,${placeholder}`}" alt="${animal.name || 'Livestock'}" class="livestock-photo">
            <h3 class="livestock-name">${animal.name || `${animal.animal_type} #${animal.id}`}</h3>
            <p class="livestock-info">
              <strong>Type:</strong> ${animal.animal_type}<br>
              <strong>Breed:</strong> ${animal.breed}<br>
              <strong>Age:</strong> ${animal.current_age} months<br>
              <strong>Weight:</strong> ${animal.current_weight} kg<br>
              <strong>Health:</strong> ${animal.health_status}
            </p>
          </div>
        `;
      }
      html += '</div>';
      if (i + 4 < livestock.length) {
        html += pageBreak;
      }
    }
    return html;
  };

  const getDateRangeForTimeframe = (timeframe) => {
    const now = moment();
    switch (timeframe) {
      case 'week':
        return `${now.startOf('week').format('MMMM D, YYYY')} to ${now.endOf('week').format('MMMM D, YYYY')}`;
      case 'month':
        return now.format('MMMM YYYY');
      case 'year':
        return now.format('YYYY');
      default:
        return '';
    }
  };

  const getLogoBase64 = async () => {
    try {
      const asset = Asset.fromModule(require('../../assets/logo.png'));
      await asset.downloadAsync();
      const base64 = await FileSystem.readAsStringAsync(asset.localUri, { encoding: FileSystem.EncodingType.Base64 });
      return base64;
    } catch (error) {
      console.error('Error loading logo:', error);
      return '';
    }
  };
  const getPlaceholder = async () => {
    try {
      const asset = Asset.fromModule(require('../../assets/placeholder.png'));
      await asset.downloadAsync();
      const base64 = await FileSystem.readAsStringAsync(asset.localUri, { encoding: FileSystem.EncodingType.Base64 });
      return base64;
    } catch (error) {
      console.error('Error loading logo:', error);
      return '';
    }
  };
  const calculateLivestockStats = (livestock) => {
    const stats = {};
    livestock.forEach(animal => {
      stats[animal.animal_type] = (stats[animal.animal_type] || 0) + 1;
    });
    return stats;
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Generate Report</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Select Timeframe:</Text>
          <Picker
            selectedValue={timeframe}
            onValueChange={(itemValue) => setTimeframe(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Weekly" value="week" />
            <Picker.Item label="Monthly" value="month" />
            <Picker.Item label="Yearly" value="year" />
          </Picker>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateReport}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="file-download" size={24} color="#FFFFFF" />
                <Text style={styles.generateButtonText}>Generate Report</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 5,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ReportGenerator;