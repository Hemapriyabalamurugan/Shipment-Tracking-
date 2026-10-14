//package com.shipment.delivery.service;
//
//import com.shipment.delivery.entity.DeliveryAssignment;
//import com.shipment.delivery.repository.DeliveryAssignmentRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import com.shipment.delivery.dto.DeliveryAnalyticsDto;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class DeliveryAssignmentService {
//
//    private final DeliveryAssignmentRepository repository;
//
//    public DeliveryAssignment assignDriver(
//            DeliveryAssignment assignment
//    ) {
//
//        assignment.setAssignedAt(
//                LocalDateTime.now()
//        );
//
//        assignment.setStatus("ASSIGNED");
//
//        return repository.save(assignment);
//    }
//
//    public DeliveryAssignment acceptAssignment(
//            Long assignmentId
//    ) {
//
//        DeliveryAssignment assignment =
//                repository.findById(assignmentId)
//                        .orElseThrow(
//                                () -> new RuntimeException(
//                                        "Assignment not found"
//                                )
//                        );
//
//        assignment.setAcceptedAt(
//                LocalDateTime.now()
//        );
//
//        assignment.setStatus("ACCEPTED");
//
//        return repository.save(assignment);
//    }
//
//    public DeliveryAssignment completeAssignment(
//            Long assignmentId
//    ) {
//
//        DeliveryAssignment assignment =
//                repository.findById(assignmentId)
//                        .orElseThrow(
//                                () -> new RuntimeException(
//                                        "Assignment not found"
//                                )
//                        );
//
//        assignment.setCompletedAt(
//                LocalDateTime.now()
//        );
//
//        assignment.setStatus("COMPLETED");
//
//        return repository.save(assignment);
//    }
//
//    public List<DeliveryAssignment> getDriverAssignments(
//            Long driverId
//    ) {
//
//        return repository.findByDriverId(driverId);
//    }
//
//    public DeliveryAnalyticsDto getAnalytics() {
//
//        long totalAssignments =
//                repository.count();
//
//        long assigned =
//                repository.countByStatus("ASSIGNED");
//
//        long accepted =
//                repository.countByStatus("ACCEPTED");
//
//        long completed =
//                repository.countByStatus("COMPLETED");
//
//        double completionRate = 0.0;
//
//        if (totalAssignments > 0) {
//            completionRate =
//                    ((double) completed / totalAssignments) * 100;
//        }
//
//        return DeliveryAnalyticsDto.builder()
//                .totalAssignments(totalAssignments)
//                .assignedDeliveries(assigned)
//                .acceptedDeliveries(accepted)
//                .completedDeliveries(completed)
//                .completionRate(completionRate)
//                .build();
//    }
//}

package com.shipment.delivery.service;

import com.shipment.delivery.dto.DeliveryAnalyticsDto;
import com.shipment.delivery.entity.DeliveryAssignment;
import com.shipment.delivery.repository.DeliveryAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryAssignmentService {

    private final DeliveryAssignmentRepository repository;

    public DeliveryAssignment assignDriver(DeliveryAssignment assignment) {

        assignment.setStatus("ASSIGNED");

        return repository.save(assignment);
    }

    public DeliveryAssignment acceptAssignment(Long assignmentId) {

        DeliveryAssignment assignment = repository.findById(assignmentId)
                .orElseThrow(() ->
                        new RuntimeException("Assignment not found"));

        assignment.setAcceptedAt(LocalDateTime.now());
        assignment.setStatus("ACCEPTED");

        return repository.save(assignment);
    }

    public DeliveryAssignment startDelivery(Long assignmentId) {

        DeliveryAssignment assignment = repository.findById(assignmentId)
                .orElseThrow(() ->
                        new RuntimeException("Assignment not found"));

        assignment.setStatus("IN_PROGRESS");

        return repository.save(assignment);
    }

    public DeliveryAssignment completeAssignment(Long assignmentId) {

        DeliveryAssignment assignment = repository.findById(assignmentId)
                .orElseThrow(() ->
                        new RuntimeException("Assignment not found"));

        assignment.setCompletedAt(LocalDateTime.now());
        assignment.setStatus("COMPLETED");

        return repository.save(assignment);
    }

    public DeliveryAssignment rejectAssignment(
            Long assignmentId,
            String reason) {

        DeliveryAssignment assignment = repository.findById(assignmentId)
                .orElseThrow(() ->
                        new RuntimeException("Assignment not found"));

        assignment.setRejectedAt(LocalDateTime.now());
        assignment.setCancellationReason(reason);
        assignment.setStatus("REJECTED");

        return repository.save(assignment);
    }

    public DeliveryAssignment cancelAssignment(
            Long assignmentId,
            String reason) {

        DeliveryAssignment assignment = repository.findById(assignmentId)
                .orElseThrow(() ->
                        new RuntimeException("Assignment not found"));

        assignment.setCancellationReason(reason);
        assignment.setStatus("CANCELLED");

        return repository.save(assignment);
    }

    public List<DeliveryAssignment> getDriverAssignments(Long driverId) {
        return repository.findByDriverId(driverId);
    }

    public List<DeliveryAssignment> getAssignmentsByStatus(String status) {
        return repository.findByStatus(status);
    }

    public DeliveryAnalyticsDto getAnalytics() {

        long totalAssignments = repository.count();

        long assigned = repository.countByStatus("ASSIGNED");
        long accepted = repository.countByStatus("ACCEPTED");
        long completed = repository.countByStatus("COMPLETED");

        double completionRate = 0.0;

        if (totalAssignments > 0) {
            completionRate =
                    ((double) completed / totalAssignments) * 100;
        }

        return DeliveryAnalyticsDto.builder()
                .totalAssignments(totalAssignments)
                .assignedDeliveries(assigned)
                .acceptedDeliveries(accepted)
                .completedDeliveries(completed)
                .completionRate(completionRate)
                .build();
    }
}