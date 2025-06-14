import { DocumentService } from "@/services/documentService";
import { DocumentStats, DocumentStatsResponseDto } from "@/types/document";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

const { width: screenWidth } = Dimensions.get("window");

const mockStats = {
  totalDocuments: 145,
  newDocumentsThisMonth: 23,
  newDocumentsLastMonth: 18,
  growthPercentage: 27.8,
  growthCount: 5,
  newSharedDocumentsThisWeek: 8,
  sharedDocuments: 42,
  recentDocuments: 12,
  documentsByDay: [
    { date: '2024-06-01', count: 3 },
    { date: '2024-06-02', count: 5 },
    { date: '2024-06-03', count: 2 },
    { date: '2024-06-04', count: 7 },
    { date: '2024-06-05', count: 4 },
    { date: '2024-06-06', count: 6 },
    { date: '2024-06-07', count: 8 },
    { date: '2024-06-08', count: 3 },
    { date: '2024-06-09', count: 9 },
    { date: '2024-06-10', count: 5 },
    { date: '2024-06-11', count: 4 },
    { date: '2024-06-12', count: 7 },
    { date: '2024-06-13', count: 6 }
  ]
};

interface AnalyticsTabProps {
    isActive: boolean;
}

interface StatCardProps {
    title: string;
    value: number | string;
    change?: string;
    changeType?: "positive" | "negative";
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    changeType,
    iconName,
    color,
}) => {
    const isPositive = changeType === "positive";

    return (
        <View style={styles.statCard}>
            <View style={styles.statCardContent}>
                <View style={styles.statCardLeft}>
                    <Text style={styles.statCardTitle}>{title}</Text>
                    <Text style={styles.statCardValue}>{value}</Text>
                    {change && (
                        <View style={styles.statCardChange}>
                            <Ionicons
                                name={
                                    isPositive ? "trending-up" : "trending-down"
                                }
                                size={16}
                                color={isPositive ? "#10B981" : "#EF4444"}
                            />
                            <Text
                                style={[
                                    styles.statCardChangeText,
                                    {
                                        color: isPositive
                                            ? "#10B981"
                                            : "#EF4444",
                                    },
                                ]}
                            >
                                {change}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={[styles.statCardIcon, { backgroundColor: color }]}>
                    <Ionicons name={iconName} size={24} color="white" />
                </View>
            </View>
        </View>
    );
};

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ isActive }) => {
    const [stats, setStats] = useState<DocumentStats>(mockStats);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState("7days");
    const [currentChartIndex, setCurrentChartIndex] = useState(0);

    useEffect(() => {
        if (isActive) {
            setLoading(true);
            const fetchData = async () => {
                try {
                    const response: DocumentStatsResponseDto =
                        await DocumentService.getStats();
                    setStats(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isActive]);

    if (!isActive) {
        return (
            <View style={styles.inactiveContainer}>
                <Text style={styles.inactiveText}>
                    Vui lòng kích hoạt tab Analytics để xem nội dung.
                </Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    const handleChartScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const chartWidth = screenWidth - 20;
    const currentIndex = Math.round(scrollPosition / chartWidth);
    setCurrentChartIndex(currentIndex);
  };

    // Prepare chart data
    const lineChartData = {
        labels: stats?.documentsByDay
            ? stats.documentsByDay.slice(-7).map((item) =>
                  new Date(item.date).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "numeric",
                  })
              )
            : [],
        datasets: [
            {
                data: stats?.documentsByDay
                    ? stats.documentsByDay.slice(-7).map((item) => item.count)
                    : [],
                strokeWidth: 3,
            },
        ],
    };

    const barChartData = {
        labels: ["Tháng trước", "Tháng này"],
        datasets: [
            {
                data: [
                    stats?.newDocumentsLastMonth ?? 0,
                    stats?.newDocumentsThisMonth ?? 0,
                ],
            },
        ],
    };

    const pieChartData = [
        {
            name: "Cá nhân",
            population:
                (stats?.totalDocuments ?? 0) - (stats?.sharedDocuments ?? 0),
            color: "#3B82F6",
            legendFontColor: "#374151",
            legendFontSize: 14,
        },
        {
            name: "Chia sẻ",
            population: stats?.sharedDocuments ?? 0,
            color: "#10B981",
            legendFontColor: "#374151",
            legendFontSize: 14,
        },
    ];

    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#3B82F6",
        },
    };

    const timeRangeOptions = [
        { key: "7days", label: "7 ngày" },
        { key: "30days", label: "30 ngày" },
        { key: "90days", label: "90 ngày" },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thống kê tài liệu</Text>
        <Text style={styles.headerSubtitle}>
          Tổng quan về hoạt động và xu hướng tài liệu của bạn
        </Text>
      </View>

      {/* Time Range Filter */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {timeRangeOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setTimeRange(option.key)}
              style={[
                styles.filterButton,
                timeRange === option.key && styles.filterButtonActive
              ]}
            >
              <Text style={[
                styles.filterButtonText,
                timeRange === option.key && styles.filterButtonTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Tổng tài liệu"
            value={stats.totalDocuments}
            iconName="document-text"
            color="#3B82F6"
          />
          <StatCard
            title="Mới tháng này"
            value={stats.newDocumentsThisMonth}
            change={`${stats.growthPercentage}%`}
            changeType="positive"
            iconName="trending-up"
            color="#10B981"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Tài liệu chia sẻ"
            value={stats.sharedDocuments}
            change={`${stats.newSharedDocumentsThisWeek} tuần này`}
            changeType="positive"
            iconName="share-social"
            color="#8B5CF6"
          />
          <StatCard
            title="Gần đây"
            value={stats.recentDocuments}
            iconName="time"
            color="#F59E0B"
          />
        </View>
      </View>

      {/* Charts Container with Horizontal Scroll */}
      <View style={styles.chartsSection}>
        <Text style={styles.chartsSectionTitle}>Biểu đồ thống kê</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={screenWidth - 20}
          snapToAlignment="start"
          contentInsetAdjustmentBehavior="automatic"
          onMomentumScrollEnd={handleChartScroll}
        >
          {/* Line Chart */}
          <View style={[styles.chartContainer, { width: screenWidth - 20 }]}>
            <Text style={styles.chartTitle}>Tài liệu được tạo theo ngày</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={lineChartData}
                width={Math.max(screenWidth - 60, 350)}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withDots={true}
                withInnerLines={false}
                withOuterLines={true}
              />
            </ScrollView>
          </View>

          {/* Pie Chart */}
          <View style={[styles.chartContainer, { width: screenWidth - 20 }]}>
            <Text style={styles.chartTitle}>Phân loại tài liệu</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <PieChart
                data={pieChartData}
                width={Math.max(screenWidth - 60, 350)}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                absolute
                style={styles.chart}
              />
            </ScrollView>
          </View>

          {/* Bar Chart */}
          <View style={[styles.chartContainer, { width: screenWidth - 20 }]}>
            <Text style={styles.chartTitle}>So sánh theo tháng</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={barChartData}
                width={Math.max(screenWidth - 60, 350)}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                }}
                style={styles.chart}
                showValuesOnTopOfBars={true}
              />
            </ScrollView>
          </View>
        </ScrollView>

        {/* Chart Indicators */}
        <View style={styles.chartIndicators}>
          {[0, 1, 2].map((index) => (
            <View 
              key={index}
              style={[
                styles.chartIndicator, 
                currentChartIndex !== index && styles.chartIndicatorInactive
              ]} 
            />
          ))}
        </View>
      </View>

      {/* Growth Metrics */}
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsTitle}>Chỉ số tăng trưởng</Text>
        
        <View style={[styles.metricCard, { backgroundColor: '#ECFDF5' }]}>
          <View style={styles.metricContent}>
            <View>
              <Text style={[styles.metricLabel, { color: '#065F46' }]}>
                Tăng trưởng tháng này
              </Text>
              <Text style={[styles.metricValue, { color: '#047857' }]}>
                {stats.growthPercentage}%
              </Text>
            </View>
            <Ionicons name="trending-up" size={32} color="#10B981" />
          </View>
        </View>

        <View style={[styles.metricCard, { backgroundColor: '#EFF6FF' }]}>
          <View style={styles.metricContent}>
            <View>
              <Text style={[styles.metricLabel, { color: '#1E3A8A' }]}>
                Số lượng tăng thêm
              </Text>
              <Text style={[styles.metricValue, { color: '#1D4ED8' }]}>
                {stats.growthCount} tài liệu
              </Text>
            </View>
            <Ionicons name="document-text" size={32} color="#3B82F6" />
          </View>
        </View>

        <View style={[styles.metricCard, { backgroundColor: '#F5F3FF' }]}>
          <View style={styles.metricContent}>
            <View>
              <Text style={[styles.metricLabel, { color: '#5B21B6' }]}>
                Chia sẻ tuần này
              </Text>
              <Text style={[styles.metricValue, { color: '#7C3AED' }]}>
                {stats.newSharedDocumentsThisWeek} tài liệu
              </Text>
            </View>
            <Ionicons name="share-social" size={32} color="#8B5CF6" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  inactiveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  inactiveText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterScrollContent: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 6,
    marginLeft: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statCardLeft: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statCardChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCardChangeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  statCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartsSection: {
    marginBottom: 20,
  },
  chartsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  chartContainer: {
    backgroundColor: 'white',
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  chartIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  chartIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginHorizontal: 4,
  },
  chartIndicatorInactive: {
    backgroundColor: '#D1D5DB',
  },
  metricsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  metricCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  metricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AnalyticsTab;