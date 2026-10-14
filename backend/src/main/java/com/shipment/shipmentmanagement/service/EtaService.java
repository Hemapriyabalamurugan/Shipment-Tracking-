package com.shipment.shipmentmanagement.service;

import com.shipment.shipmentmanagement.dto.EtaResponse;

public interface EtaService {

    EtaResponse calculateEta(Long shipmentId);
}