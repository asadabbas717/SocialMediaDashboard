import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const demoAnalytics = {
  lastUpdated: "May 6, 2026",
  summary: {
    totalFollowers: 48250,
    followerGrowth: 12.8,
    engagementRate: 8.4,
    totalReach: 126400,
  },
  platforms: [
    {
      name: "Instagram",
      followers: 28600,
      growth: 14.2,
      likes: 18400,
      comments: 2450,
      shares: 980,
      reach: 76200,
      engagementRate: 9.1,
    },
    {
      name: "X / Twitter",
      followers: 19650,
      growth: 10.3,
      likes: 9200,
      comments: 1180,
      shares: 740,
      reach: 50200,
      engagementRate: 7.6,
    },
  ],
  monthlyGrowth: [
    { month: "Jan", followers: 32500 },
    { month: "Feb", followers: 35600 },
    { month: "Mar", followers: 39100 },
    { month: "Apr", followers: 43400 },
    { month: "May", followers: 48250 },
  ],
};

export default function App() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);

    try {
      /*
        Real API example:

        const response = await fetch("https://your-backend.com/api/social-analytics");
        const data = await response.json();
        setAnalytics(data);

        Important:
        Do not place Instagram/X access tokens directly inside the mobile app.
        Use your own backend API to securely call Instagram/X APIs.
      */

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnalytics(demoAnalytics);
    } catch (error) {
      Alert.alert("Error", "Unable to fetch social media analytics.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const getMaxFollowers = () => {
    if (!analytics) return 1;
    return Math.max(...analytics.monthlyGrowth.map((item) => item.followers));
  };

  const generateReportHTML = () => {
    const instagram = analytics.platforms[0];
    const twitter = analytics.platforms[1];

    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              color: #1f2937;
            }

            h1 {
              color: #2563eb;
              text-align: center;
            }

            h2 {
              color: #111827;
              margin-top: 28px;
            }

            .summary {
              background-color: #f3f4f6;
              padding: 16px;
              border-radius: 10px;
              margin-top: 20px;
            }

            .metric {
              margin-bottom: 8px;
              font-size: 15px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
            }

            th, td {
              border: 1px solid #d1d5db;
              padding: 10px;
              text-align: left;
              font-size: 14px;
            }

            th {
              background-color: #2563eb;
              color: white;
            }

            .footer {
              margin-top: 35px;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
          </style>
        </head>

        <body>
          <h1>Internee.pk Social Media Analytics Report</h1>

          <div class="summary">
            <p class="metric"><b>Report Date:</b> ${analytics.lastUpdated}</p>
            <p class="metric"><b>Total Followers:</b> ${formatNumber(
              analytics.summary.totalFollowers
            )}</p>
            <p class="metric"><b>Follower Growth:</b> ${
              analytics.summary.followerGrowth
            }%</p>
            <p class="metric"><b>Engagement Rate:</b> ${
              analytics.summary.engagementRate
            }%</p>
            <p class="metric"><b>Total Reach:</b> ${formatNumber(
              analytics.summary.totalReach
            )}</p>
          </div>

          <h2>Platform Performance</h2>

          <table>
            <tr>
              <th>Platform</th>
              <th>Followers</th>
              <th>Growth</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Shares</th>
              <th>Reach</th>
              <th>Engagement Rate</th>
            </tr>

            <tr>
              <td>${instagram.name}</td>
              <td>${formatNumber(instagram.followers)}</td>
              <td>${instagram.growth}%</td>
              <td>${formatNumber(instagram.likes)}</td>
              <td>${formatNumber(instagram.comments)}</td>
              <td>${formatNumber(instagram.shares)}</td>
              <td>${formatNumber(instagram.reach)}</td>
              <td>${instagram.engagementRate}%</td>
            </tr>

            <tr>
              <td>${twitter.name}</td>
              <td>${formatNumber(twitter.followers)}</td>
              <td>${twitter.growth}%</td>
              <td>${formatNumber(twitter.likes)}</td>
              <td>${formatNumber(twitter.comments)}</td>
              <td>${formatNumber(twitter.shares)}</td>
              <td>${formatNumber(twitter.reach)}</td>
              <td>${twitter.engagementRate}%</td>
            </tr>
          </table>

          <h2>Monthly Follower Growth</h2>

          <table>
            <tr>
              <th>Month</th>
              <th>Followers</th>
            </tr>

            ${analytics.monthlyGrowth
              .map(
                (item) => `
                <tr>
                  <td>${item.month}</td>
                  <td>${formatNumber(item.followers)}</td>
                </tr>
              `
              )
              .join("")}
          </table>

          <p class="footer">
            Generated by Social Media Dashboard App for Internee.pk Internship Assignment.
          </p>
        </body>
      </html>
    `;
  };

  const exportPDFReport = async () => {
    if (!analytics) {
      Alert.alert("No Data", "Please fetch analytics first.");
      return;
    }

    try {
      const html = generateReportHTML();

      const file = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (!isSharingAvailable) {
        Alert.alert("PDF Created", `PDF saved at: ${file.uri}`);
        return;
      }

      await Sharing.shareAsync(file.uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Analytics Report",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      Alert.alert("Error", "Unable to export PDF report.");
    }
  };

  if (loading && !analytics) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </SafeAreaView>
    );
  }

  if (!analytics) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>No analytics data found.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={fetchAnalyticsData}>
          <Text style={styles.buttonText}>Fetch Data</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const maxFollowers = getMaxFollowers();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Social Media Dashboard</Text>
          <Text style={styles.subtitle}>
            Track Internee.pk follower growth and engagement performance.
          </Text>
          <Text style={styles.dateText}>Last updated: {analytics.lastUpdated}</Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Followers</Text>
            <Text style={styles.metricValue}>
              {formatNumber(analytics.summary.totalFollowers)}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Growth</Text>
            <Text style={styles.metricValue}>
              +{analytics.summary.followerGrowth}%
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Engagement</Text>
            <Text style={styles.metricValue}>
              {analytics.summary.engagementRate}%
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Reach</Text>
            <Text style={styles.metricValue}>
              {formatNumber(analytics.summary.totalReach)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Platform Analytics</Text>

          {analytics.platforms.map((platform) => (
            <View key={platform.name} style={styles.platformBox}>
              <View style={styles.platformHeader}>
                <Text style={styles.platformName}>{platform.name}</Text>
                <Text style={styles.growthText}>+{platform.growth}%</Text>
              </View>

              <View style={styles.platformStats}>
                <Text style={styles.statText}>
                  Followers: {formatNumber(platform.followers)}
                </Text>
                <Text style={styles.statText}>
                  Reach: {formatNumber(platform.reach)}
                </Text>
                <Text style={styles.statText}>
                  Likes: {formatNumber(platform.likes)}
                </Text>
                <Text style={styles.statText}>
                  Comments: {formatNumber(platform.comments)}
                </Text>
                <Text style={styles.statText}>
                  Shares: {formatNumber(platform.shares)}
                </Text>
                <Text style={styles.statText}>
                  Engagement Rate: {platform.engagementRate}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Follower Growth</Text>

          {analytics.monthlyGrowth.map((item) => {
            const barWidth = `${(item.followers / maxFollowers) * 100}%`;

            return (
              <View key={item.month} style={styles.chartRow}>
                <Text style={styles.monthText}>{item.month}</Text>

                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: barWidth }]} />
                </View>

                <Text style={styles.chartValue}>{formatNumber(item.followers)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Engagement Summary</Text>

          {analytics.platforms.map((platform) => (
            <View key={platform.name} style={styles.engagementRow}>
              <Text style={styles.engagementPlatform}>{platform.name}</Text>

              <View style={styles.engagementBarBackground}>
                <View
                  style={[
                    styles.engagementBarFill,
                    { width: `${platform.engagementRate * 8}%` },
                  ]}
                />
              </View>

              <Text style={styles.engagementValue}>
                {platform.engagementRate}%
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={fetchAnalyticsData}>
          <Text style={styles.buttonText}>
            {loading ? "Refreshing..." : "Refresh Analytics"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pdfButton} onPress={exportPDFReport}>
          <Text style={styles.buttonText}>Export PDF Report</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Assignment Note</Text>
          <Text style={styles.infoText}>
            This app uses demo REST-style data. In a real company project, the
            fetchAnalyticsData function will call a backend API connected with
            Instagram and X/Twitter developer APIs.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    padding: 18,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#374151",
  },

  errorText: {
    fontSize: 17,
    color: "#ef4444",
    marginBottom: 16,
  },

  header: {
    marginTop: 20,
    marginBottom: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },

  dateText: {
    fontSize: 13,
    color: "#2563eb",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  metricCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  metricLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },

  metricValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 14,
  },

  platformBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  platformHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  platformName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  growthText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
  },

  platformStats: {
    gap: 6,
  },

  statText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  monthText: {
    width: 38,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  barBackground: {
    flex: 1,
    height: 14,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
  },

  barFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 10,
  },

  chartValue: {
    width: 70,
    fontSize: 13,
    color: "#374151",
    textAlign: "right",
  },

  engagementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  engagementPlatform: {
    width: 90,
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },

  engagementBarBackground: {
    flex: 1,
    height: 13,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
  },

  engagementBarFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 10,
  },

  engagementValue: {
    width: 45,
    fontSize: 13,
    color: "#374151",
    textAlign: "right",
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  pdfButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  infoBox: {
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1d4ed8",
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 21,
  },
});