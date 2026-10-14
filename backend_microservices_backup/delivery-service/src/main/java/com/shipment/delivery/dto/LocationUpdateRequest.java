//
package com.shipment.delivery.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LocationUpdateRequest {

    @NotNull
    private Long driverId;

    private Long vehicleId;

    @NotNull
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private BigDecimal latitude;

    @NotNull
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private BigDecimal longitude;

    private BigDecimal speedKmh;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "360.0")
    private BigDecimal heading;

    @DecimalMin(value = "0.0")
    private BigDecimal accuracy;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    private BigDecimal batteryLevel;
}