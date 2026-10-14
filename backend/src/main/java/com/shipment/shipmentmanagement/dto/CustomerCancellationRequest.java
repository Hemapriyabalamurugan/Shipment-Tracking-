package com.shipment.shipmentmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerCancellationRequest {

    @NotBlank(message = "Cancellation reason is required")
    @Size(
            min = 5,
            max = 1000,
            message = "Cancellation reason must be between 5 and 1000 characters"
    )
    private String reason;
}