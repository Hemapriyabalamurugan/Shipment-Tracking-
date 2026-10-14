package com.shipment.auth.dto.request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
