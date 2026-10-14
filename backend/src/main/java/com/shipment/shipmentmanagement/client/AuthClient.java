package com.shipment.shipmentmanagement.client;

import com.shipment.shipmentmanagement.dto.CustomerLookupResponse;
import com.shipment.shipmentmanagement.dto.OperatorResponse;
import com.shipment.shipmentmanagement.dto.UserProfileResponse;

import java.util.List;

public interface AuthClient {

    List<OperatorResponse> getOperators();

    CustomerLookupResponse findCustomer(String phone, String receiverName);

    UserProfileResponse getCurrentUser();
}