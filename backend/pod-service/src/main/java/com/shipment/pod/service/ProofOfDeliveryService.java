package com.shipment.pod.service;

import com.shipment.pod.client.ShipmentClient;
import com.shipment.pod.dto.ProofOfDeliveryRequest;
import com.shipment.pod.dto.ProofOfDeliveryResponse;
import com.shipment.pod.entity.ProofOfDelivery;
import com.shipment.pod.repository.ProofOfDeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.shipment.pod.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import com.shipment.pod.client.ShipmentClient;
import com.shipment.pod.dto.ShipmentAnalyticsDataResponse;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProofOfDeliveryService {

    private final ProofOfDeliveryRepository repository;
    private final CloudinaryService cloudinaryService;
    private final ShipmentClient shipmentClient;

//    public ProofOfDelivery create(
//            ProofOfDeliveryRequest request) {

public ProofOfDelivery create(
        ProofOfDeliveryRequest request,
        MultipartFile photo) throws IOException {
    String photoUrl = cloudinaryService.uploadImage(photo);
        ProofOfDelivery pod = ProofOfDelivery.builder()
                .shipmentId(request.getShipmentId())
                .recipientName(request.getRecipientName())
                .signatureUrl(request.getSignatureUrl())
                .photoUrl(photoUrl)
                .deliveryNotes(request.getDeliveryNotes())
                .recipientPhone(request.getRecipientPhone())
                .verificationStatus("PENDING")
                .capturedAt(LocalDateTime.now())
//                .signatureData(request.getSignatureUrl())
//                .photoUrl(request.getPhotoUrl())
//                .deliveryNotes(request.getNotes())
//                .verificationStatus(request.getDeliveryStatus())
//                .verifiedAt(LocalDateTime.now())
//                .verified(false)
                .build();

        return repository.save(pod);
    }

//    public List<ProofOfDelivery> getByShipment(Long shipmentId) {
//        return repository.findByShipmentId(shipmentId);
//    }
public ProofOfDelivery getByShipment(Long shipmentId) {
    return repository.findByShipmentId(shipmentId)
            .orElseThrow();
}

//    public List<ProofOfDelivery> getByDriver(Long driverId) {
//        return repository.findByDriverId(driverId);
//    }

//    public List<ProofOfDelivery> getPendingVerification() {
//        return repository.findByVerified(false);
//    }
public List<ProofOfDelivery> getPendingVerification() {
    return repository.findByVerificationStatus("PENDING");
}
//    public ProofOfDelivery verify(Long id) {
//
//        ProofOfDelivery pod =
//                repository.findById(id)
//                        .orElseThrow();
//
//        pod.setVerified(true);
//
//        return repository.save(pod);
//    }

//    public ProofOfDelivery verify(Long id)
public ProofOfDelivery verify(Long id, Long businessClientId)
    {


        ProofOfDelivery pod = repository.findById(id)
                .orElseThrow();


        ShipmentAnalyticsDataResponse shipment =
                shipmentClient.getShipmentForVerification(
                        pod.getShipmentId()
                );

        if (!shipment.getBusinessClientId().equals(businessClientId)) {
            throw new RuntimeException(
                    "You are not allowed to verify this Proof of Delivery."
            );
        }


        pod.setVerificationStatus("VERIFIED");
        pod.setVerifiedAt(LocalDateTime.now());

//        extra feature ==========
//        pod.setVerifiedBy(businessClientId);
        return repository.save(pod);
    }
//public ProofOfDelivery verify(Long podId, Long businessClientId) {
//
//    ProofOfDelivery pod = repository.findById(podId)
//            .orElseThrow();
//
//    pod.setVerificationStatus("VERIFIED");
//    pod.setVerifiedAt(LocalDateTime.now());
//    pod.setVerifiedBy(businessClientId);
//
//    return repository.save(pod);
//}
//    public PodAnalyticsDto getAnalytics() {
//
//        long totalProofs =
//                repository.count();
//
////        long verifiedProofs =
////                repository.findByVerified(true)
////                        .size();
////
////        long pendingProofs =
////                repository.findByVerified(false)
////                        .size();
////        long verifiedProofs =
////                repository.countByVerified(true);
////
////        long pendingProofs =
////                repository.countByVerified(false);
//        long verifiedProofs =
//                repository.findByVerificationStatus("VERIFIED").size();
//
//        long pendingProofs =
//                repository.findByVerificationStatus("PENDING").size();
//
//        double verificationRate = 0.0;
//
//        if (totalProofs > 0) {
//            verificationRate =
//                    ((double) verifiedProofs / totalProofs) * 100;
//        }
//
//        return PodAnalyticsDto.builder()
//                .totalProofs(totalProofs)
//                .verifiedProofs(verifiedProofs)
//                .pendingProofs(pendingProofs)
//                .verificationRate(verificationRate)
//                .build();
//    }
//public List<ProofOfDelivery> getAll() {
//    return repository.findAll();
//}
public List<ProofOfDeliveryResponse> getAll() {

    return repository.findAll()
            .stream()
            .map(pod -> {

                ShipmentAnalyticsDataResponse shipment =
                        shipmentClient.getShipmentForVerification(
                                pod.getShipmentId()
                        );

                return ProofOfDeliveryResponse.builder()
                        .id(pod.getId())
                        .shipmentId(pod.getShipmentId())
                        .trackingNumber(shipment.getTrackingNumber())
                        .recipientName(pod.getRecipientName())
                        .recipientPhone(pod.getRecipientPhone())
                        .signatureUrl(pod.getSignatureUrl())
                        .photoUrl(pod.getPhotoUrl())
                        .deliveryNotes(pod.getDeliveryNotes())
                        .verificationStatus(pod.getVerificationStatus())
                        .verifiedBy(pod.getVerifiedBy())
                        .verifiedAt(pod.getVerifiedAt())
                        .capturedAt(pod.getCapturedAt())
                        .build();
            })
            .toList();
}
}