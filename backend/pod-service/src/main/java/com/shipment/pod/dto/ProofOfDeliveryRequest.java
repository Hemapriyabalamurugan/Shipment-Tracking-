//package com.shipment.pod.dto;
//
//import lombok.Data;
//
//@Data
//public class ProofOfDeliveryRequest {
//
//    private Long shipmentId;

//    private Long driverId;
//
//    private String recipientName;
//
//    private String signatureUrl;
//
//    private String photoUrl;
//
//    private String notes;
//
//    private String deliveryStatus;
//
//   private String deliveryNotes;
//}

package com.shipment.pod.dto;

import lombok.Data;

@Data
public class ProofOfDeliveryRequest {

    private Long shipmentId;

    private String recipientPhone;

    private String recipientName;

    private String signatureUrl;

    private String photoUrl;

    private String deliveryNotes;
}