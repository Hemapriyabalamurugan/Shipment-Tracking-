package com.shipment.pod.service;

import com.shipment.pod.dto.ProofOfDeliveryRequest;
import com.shipment.pod.entity.ProofOfDelivery;
import com.shipment.pod.repository.ProofOfDeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.shipment.pod.dto.PodAnalyticsDto;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProofOfDeliveryService {

    private final ProofOfDeliveryRepository repository;

    public ProofOfDelivery create(
            ProofOfDeliveryRequest request) {

        ProofOfDelivery pod = ProofOfDelivery.builder()
                .shipmentId(request.getShipmentId())
                .recipientName(request.getRecipientName())
                .signatureData(request.getSignatureData())
                .photoUrl(request.getPhotoUrl())
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

    public List<ProofOfDelivery> getByShipment(Long shipmentId) {
        return repository.findByShipmentId(shipmentId);
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

    public ProofOfDelivery verify(Long id) {

        ProofOfDelivery pod = repository.findById(id)
                .orElseThrow();

        pod.setVerificationStatus("VERIFIED");
        pod.setVerifiedAt(LocalDateTime.now());

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
    public PodAnalyticsDto getAnalytics() {

        long totalProofs =
                repository.count();

//        long verifiedProofs =
//                repository.findByVerified(true)
//                        .size();
//
//        long pendingProofs =
//                repository.findByVerified(false)
//                        .size();
//        long verifiedProofs =
//                repository.countByVerified(true);
//
//        long pendingProofs =
//                repository.countByVerified(false);
        long verifiedProofs =
                repository.findByVerificationStatus("VERIFIED").size();

        long pendingProofs =
                repository.findByVerificationStatus("PENDING").size();

        double verificationRate = 0.0;

        if (totalProofs > 0) {
            verificationRate =
                    ((double) verifiedProofs / totalProofs) * 100;
        }

        return PodAnalyticsDto.builder()
                .totalProofs(totalProofs)
                .verifiedProofs(verifiedProofs)
                .pendingProofs(pendingProofs)
                .verificationRate(verificationRate)
                .build();
    }
}