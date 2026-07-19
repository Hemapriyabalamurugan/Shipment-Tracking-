package com.shipment.analyticsreport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    // Shipment Metrics
    private Long totalShipments;
    private Long deliveredShipments;
    private Long failedDeliveries;
    private Double deliverySuccessRate;
    private Double averageDeliveryTimeDays;

    // Delivery Metrics
    private Long totalAssignments;
    private Long completedDeliveries;
    private Double assignmentCompletionRate;


    //pod service
    private Long totalProofs;

    private Long verifiedProofs;

    private Long pendingProofs;

    private Double podVerificationRate;

//    auth related
    private Long totalUsers;

    private Long totalCustomers;

    private Long totalBusinessClients;

    private Long totalLogisticsOperators;

    private Long totalSupportAgents;

    private Long totalAdmins;

    private Long activeUsers;

    private Long inactiveUsers;

    private Long totalNotifications;

    private Long unreadNotifications;
}