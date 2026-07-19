//package com.shipment.analyticsreport.service;
//
//import com.shipment.analyticsreport.dto.CustomerDashboardResponse;
//import org.springframework.stereotype.Service;
//import com.shipment.analyticsreport.client.ShipmentClient;
//import lombok.RequiredArgsConstructor;
//import com.shipment.analyticsreport.dto.ShipmentAnalyticsDto;
//import com.shipment.analyticsreport.dto.CustomerShipmentAnalyticsDto;
//import com.shipment.analyticsreport.client.NotificationClient;
//import com.shipment.analyticsreport.client.DeliveryClient;
//import com.shipment.analyticsreport.dto.DeliveryAnalyticsDto;
//import com.shipment.analyticsreport.dto.AdminDashboardResponse;
//import com.shipment.analyticsreport.client.PodClient;
//import com.shipment.analyticsreport.dto.PodAnalyticsDto;
//import com.shipment.analyticsreport.dto.BusinessShipmentAnalyticsDto;
//import com.shipment.analyticsreport.dto.BusinessDashboardResponse;
//import com.shipment.analyticsreport.client.AuthClient;
//import com.shipment.analyticsreport.dto.UserAnalyticsDto;
//
//
//@Service
//@RequiredArgsConstructor
//public class DashboardService {
//
//    private final ShipmentClient shipmentClient;
//    private final NotificationClient notificationClient;
//    private final DeliveryClient deliveryClient;
//    private final PodClient podClient;
//    private final AuthClient authClient;
//
//
//public CustomerDashboardResponse getCustomerDashboard(
//        Long customerId
//) {
//
//
//
//    CustomerShipmentAnalyticsDto shipmentAnalytics =
//            shipmentClient.getCustomerAnalytics(customerId);
//
//
//    ShipmentAnalyticsDto shipmentSummary =
//            shipmentClient.getShipmentAnalytics();
//    long notificationCount =
//            notificationClient.getUnreadNotificationCount(
//                    customerId
//            );
//
//
//    return CustomerDashboardResponse.builder()
//            .activeShipments(
//                    shipmentAnalytics.getActiveShipments()
//            )
//            .shipmentHistory(
//                    shipmentAnalytics.getTotalShipments()
//            )
//            .deliveredShipments(
//                    shipmentAnalytics.getDeliveredShipments()
//            )
//            .inTransitShipments(
//                    shipmentAnalytics.getInTransitShipments()
//            )
//            .pendingShipments(
//                    shipmentAnalytics.getPendingShipments()
//            )
//            .notificationCount(notificationCount)
//
//
//
//            .averageDeliveryTime(
//                    shipmentSummary.getAverageDeliveryTimeDays()
//                            + " Days"
//            )
//
//            .deliverySuccessRate(
//                    shipmentSummary.getDeliverySuccessRate()
//            )
//
//            .build();
//}
//
//
//public ShipmentAnalyticsDto getShipmentAnalytics() {
//
//    System.out.println("Calling Shipment Service...");
//
//
//    ShipmentAnalyticsDto dto =
//            shipmentClient.getShipmentAnalytics();
//
//    System.out.println("Response: " + dto);
//
//    return dto;
//}
//
//    public DeliveryAnalyticsDto getDeliveryAnalytics() {
//
//        DeliveryAnalyticsDto dto =
//                deliveryClient.getAnalytics();
//
//        System.out.println("Delivery Analytics: " + dto);
//
//        return dto;
//    }
//
//    public AdminDashboardResponse getAdminDashboard() {
////
//
//        ShipmentAnalyticsDto shipmentAnalytics =
//                shipmentClient.getShipmentAnalytics();
//
//        DeliveryAnalyticsDto deliveryAnalytics =
//                deliveryClient.getAnalytics();
//
//        PodAnalyticsDto podAnalytics =
//                podClient.getAnalytics();
//
//        UserAnalyticsDto userAnalytics =
//                authClient.getUserAnalytics();
//        return AdminDashboardResponse.builder()
//
//                .totalShipments(
//                        shipmentAnalytics.getTotalShipments()
//                )
//
//                .deliveredShipments(
//                        shipmentAnalytics.getDeliveredShipments()
//                )
//
//                .failedDeliveries(
//                        shipmentAnalytics.getFailedDeliveries()
//                )
//
//                .deliverySuccessRate(
//                        shipmentAnalytics.getDeliverySuccessRate()
//                )
//
//                .averageDeliveryTimeDays(
//                        shipmentAnalytics.getAverageDeliveryTimeDays()
//                )
//
//                .totalAssignments(
//                        deliveryAnalytics.getTotalAssignments()
//                )
//
//                .completedDeliveries(
//                        deliveryAnalytics.getCompletedDeliveries()
//                )
//
//                .assignmentCompletionRate(
//                        deliveryAnalytics.getCompletionRate()
//                )
//
//                .totalProofs(
//                        podAnalytics.getTotalProofs()
//                )
//
//                .verifiedProofs(
//                        podAnalytics.getVerifiedProofs()
//                )
//
//                .pendingProofs(
//                        podAnalytics.getPendingProofs()
//                )
//
//                .podVerificationRate(
//                        podAnalytics.getVerificationRate()
//                )
//
//                .totalUsers(
//                        userAnalytics.getTotalUsers()
//                )
//                .totalCustomers(
//                        userAnalytics.getTotalCustomers()
//                )
//                .totalBusinessClients(
//                        userAnalytics.getTotalBusinessClients()
//                )
//                .totalLogisticsOperators(
//                        userAnalytics.getTotalLogisticsOperators()
//                )
//                .totalSupportAgents(
//                        userAnalytics.getTotalSupportAgents()
//                )
//                .totalAdmins(
//                        userAnalytics.getTotalAdmins()
//                )
//                .activeUsers(
//                        userAnalytics.getActiveUsers()
//                )
//                .inactiveUsers(
//                        userAnalytics.getInactiveUsers()
//                )
//
//                .build();
//    }
//
//    public BusinessDashboardResponse getBusinessDashboard(
//            Long businessClientId
//    ) {
//
//        BusinessShipmentAnalyticsDto shipmentAnalytics =
//                shipmentClient.getBusinessAnalytics(
//                        businessClientId
//                );
//
//        long notificationCount =
//                notificationClient.getUnreadNotificationCount(
//                        businessClientId
//                );
//
//        return BusinessDashboardResponse.builder()
//                .totalShipments(
//                        shipmentAnalytics.getTotalShipments()
//                )
//                .deliveredShipments(
//                        shipmentAnalytics.getDeliveredShipments()
//                )
//                .inTransitShipments(
//                        shipmentAnalytics.getInTransitShipments()
//                )
//                .pendingShipments(
//                        shipmentAnalytics.getPendingShipments()
//                )
//                .failedDeliveries(
//                        shipmentAnalytics.getFailedDeliveries()
//                )
//                .deliverySuccessRate(
//                        shipmentAnalytics.getDeliverySuccessRate()
//                )
//                .notificationCount(
//                        notificationCount
//                )
//                .build();
//    }
//}

package com.shipment.analyticsreport.service;

import com.shipment.analyticsreport.client.AuthClient;
import com.shipment.analyticsreport.client.DeliveryClient;
import com.shipment.analyticsreport.client.NotificationClient;
import com.shipment.analyticsreport.client.PodClient;
import com.shipment.analyticsreport.client.ShipmentClient;
import com.shipment.analyticsreport.dto.AdminDashboardResponse;
import com.shipment.analyticsreport.dto.BusinessDashboardResponse;
import com.shipment.analyticsreport.dto.BusinessShipmentAnalyticsDto;
import com.shipment.analyticsreport.dto.CustomerDashboardResponse;
import com.shipment.analyticsreport.dto.CustomerShipmentAnalyticsDto;
import com.shipment.analyticsreport.dto.DeliveryAnalyticsDto;
import com.shipment.analyticsreport.dto.PodAnalyticsDto;
import com.shipment.analyticsreport.dto.ShipmentAnalyticsDto;
import com.shipment.analyticsreport.dto.UserAnalyticsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ShipmentClient shipmentClient;
    private final NotificationClient notificationClient;
    private final DeliveryClient deliveryClient;
    private final PodClient podClient;
    private final AuthClient authClient;

    public CustomerDashboardResponse getCustomerDashboard(Long customerId) {

        CustomerShipmentAnalyticsDto shipmentAnalytics =
                shipmentClient.getCustomerAnalytics(customerId);

        // TODO: Replace with customer-specific average metrics
        // once Shipment Service provides them.
        ShipmentAnalyticsDto shipmentSummary =
                shipmentClient.getShipmentAnalytics();

        long notificationCount =
                notificationClient.getUnreadNotificationCount(customerId);

        return CustomerDashboardResponse.builder()
                .activeShipments(
                        shipmentAnalytics.getActiveShipments()
                )
                .shipmentHistory(
                        shipmentAnalytics.getTotalShipments()
                )
                .deliveredShipments(
                        shipmentAnalytics.getDeliveredShipments()
                )
                .inTransitShipments(
                        shipmentAnalytics.getInTransitShipments()
                )
                .pendingShipments(
                        shipmentAnalytics.getPendingShipments()
                )
                .notificationCount(
                        notificationCount
                )
                .averageDeliveryTimeDays(
                        shipmentSummary.getAverageDeliveryTimeDays()
                )

                .deliverySuccessRate(
                        shipmentSummary.getDeliverySuccessRate()
                )
                .build();
    }

    public ShipmentAnalyticsDto getShipmentAnalytics() {
        return shipmentClient.getShipmentAnalytics();
    }

    public DeliveryAnalyticsDto getDeliveryAnalytics() {
        return deliveryClient.getAnalytics();
    }

    public AdminDashboardResponse getAdminDashboard() {

        ShipmentAnalyticsDto shipmentAnalytics =
                shipmentClient.getShipmentAnalytics();

        DeliveryAnalyticsDto deliveryAnalytics =
                deliveryClient.getAnalytics();

        PodAnalyticsDto podAnalytics =
                podClient.getAnalytics();

        UserAnalyticsDto userAnalytics =
                authClient.getUserAnalytics();

        return AdminDashboardResponse.builder()

                // Shipment Analytics
                .totalShipments(
                        shipmentAnalytics.getTotalShipments()
                )
                .deliveredShipments(
                        shipmentAnalytics.getDeliveredShipments()
                )
                .failedDeliveries(
                        shipmentAnalytics.getFailedDeliveries()
                )
                .deliverySuccessRate(
                        shipmentAnalytics.getDeliverySuccessRate()
                )
                .averageDeliveryTimeDays(
                        shipmentAnalytics.getAverageDeliveryTimeDays()
                )

                // Delivery Analytics
                .totalAssignments(
                        deliveryAnalytics.getTotalAssignments()
                )
                .completedDeliveries(
                        deliveryAnalytics.getCompletedDeliveries()
                )
                .assignmentCompletionRate(
                        deliveryAnalytics.getCompletionRate()
                )

                // POD Analytics
                .totalProofs(
                        podAnalytics.getTotalProofs()
                )
                .verifiedProofs(
                        podAnalytics.getVerifiedProofs()
                )
                .pendingProofs(
                        podAnalytics.getPendingProofs()
                )
                .podVerificationRate(
                        podAnalytics.getVerificationRate()
                )

                // User Analytics
                .totalUsers(
                        userAnalytics.getTotalUsers()
                )
                .totalCustomers(
                        userAnalytics.getTotalCustomers()
                )
                .totalBusinessClients(
                        userAnalytics.getTotalBusinessClients()
                )
                .totalLogisticsOperators(
                        userAnalytics.getTotalLogisticsOperators()
                )
                .totalSupportAgents(
                        userAnalytics.getTotalSupportAgents()
                )
                .totalAdmins(
                        userAnalytics.getTotalAdmins()
                )
                .activeUsers(
                        userAnalytics.getActiveUsers()
                )
                .inactiveUsers(
                        userAnalytics.getInactiveUsers()
                )

                .build();
    }

    public BusinessDashboardResponse getBusinessDashboard(
            Long businessClientId
    ) {

        BusinessShipmentAnalyticsDto shipmentAnalytics =
                shipmentClient.getBusinessAnalytics(
                        businessClientId
                );

        long notificationCount =
                notificationClient.getUnreadNotificationCount(
                        businessClientId
                );

        return BusinessDashboardResponse.builder()
                .totalShipments(
                        shipmentAnalytics.getTotalShipments()
                )
                .deliveredShipments(
                        shipmentAnalytics.getDeliveredShipments()
                )
                .inTransitShipments(
                        shipmentAnalytics.getInTransitShipments()
                )
                .pendingShipments(
                        shipmentAnalytics.getPendingShipments()
                )
                .failedDeliveries(
                        shipmentAnalytics.getFailedDeliveries()
                )
                .deliverySuccessRate(
                        shipmentAnalytics.getDeliverySuccessRate()
                )
                .notificationCount(
                        notificationCount
                )
                .build();
    }
}