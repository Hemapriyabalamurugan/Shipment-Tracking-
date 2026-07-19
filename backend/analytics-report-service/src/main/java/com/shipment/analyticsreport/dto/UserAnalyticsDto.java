package com.shipment.analyticsreport.dto;
import lombok.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAnalyticsDto {
    private Long totalUsers;

    private Long totalCustomers;

    private Long totalBusinessClients;

    private Long totalLogisticsOperators;

    private Long totalSupportAgents;

    private Long totalAdmins;

    private Long activeUsers;

    private Long inactiveUsers;
}
