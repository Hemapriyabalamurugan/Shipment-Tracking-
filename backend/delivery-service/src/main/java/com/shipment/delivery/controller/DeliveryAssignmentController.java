//package com.shipment.delivery.controller;
//
//import com.shipment.delivery.entity.DeliveryAssignment;
//import com.shipment.delivery.service.DeliveryAssignmentService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//import com.shipment.delivery.dto.DeliveryAnalyticsDto;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/deliveries")
//@RequiredArgsConstructor
//@CrossOrigin
//public class DeliveryAssignmentController {
//
//    private final DeliveryAssignmentService service;
//
//    @PostMapping("/assign")
//    public DeliveryAssignment assignDriver(
//            @RequestBody DeliveryAssignment assignment
//    ) {
//
//        return service.assignDriver(
//                assignment
//        );
//    }
//
//    @PutMapping("/{assignmentId}/accept")
//    public DeliveryAssignment acceptAssignment(
//            @PathVariable Long assignmentId
//    ) {
//
//        return service.acceptAssignment(
//                assignmentId
//        );
//    }
//
//    @PutMapping("/{assignmentId}/complete")
//    public DeliveryAssignment completeAssignment(
//            @PathVariable Long assignmentId
//    ) {
//
//        return service.completeAssignment(
//                assignmentId
//        );
//    }
//
//    @GetMapping("/driver/{driverId}")
//    public List<DeliveryAssignment> getDriverAssignments(
//            @PathVariable Long driverId
//    ) {
//
//        return service.getDriverAssignments(
//                driverId
//        );
//    }
//
//    @GetMapping("/analytics")
//    public DeliveryAnalyticsDto getAnalytics() {
//
//        return service.getAnalytics();
//    }
//}

package com.shipment.delivery.controller;

import com.shipment.delivery.dto.DeliveryAnalyticsDto;
import com.shipment.delivery.entity.DeliveryAssignment;
import com.shipment.delivery.service.DeliveryAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
@CrossOrigin
public class DeliveryAssignmentController {

    private final DeliveryAssignmentService service;

    @PostMapping("/assign")
    public DeliveryAssignment assignDriver(
            @RequestBody DeliveryAssignment assignment) {

        return service.assignDriver(assignment);
    }

    @PutMapping("/{assignmentId}/accept")
    public DeliveryAssignment acceptAssignment(
            @PathVariable Long assignmentId) {

        return service.acceptAssignment(assignmentId);
    }

    @PutMapping("/{assignmentId}/start")
    public DeliveryAssignment startDelivery(
            @PathVariable Long assignmentId) {

        return service.startDelivery(assignmentId);
    }

    @PutMapping("/{assignmentId}/complete")
    public DeliveryAssignment completeAssignment(
            @PathVariable Long assignmentId) {

        return service.completeAssignment(assignmentId);
    }

    @PutMapping("/{assignmentId}/reject")
    public DeliveryAssignment rejectAssignment(
            @PathVariable Long assignmentId,
            @RequestParam String reason) {

        return service.rejectAssignment(assignmentId, reason);
    }

    @PutMapping("/{assignmentId}/cancel")
    public DeliveryAssignment cancelAssignment(
            @PathVariable Long assignmentId,
            @RequestParam String reason) {

        return service.cancelAssignment(assignmentId, reason);
    }

    @GetMapping("/driver/{driverId}")
    public List<DeliveryAssignment> getDriverAssignments(
            @PathVariable Long driverId) {

        return service.getDriverAssignments(driverId);
    }

    @GetMapping("/status/{status}")
    public List<DeliveryAssignment> getAssignmentsByStatus(
            @PathVariable String status) {

        return service.getAssignmentsByStatus(status);
    }

    @GetMapping("/analytics")
    public DeliveryAnalyticsDto getAnalytics() {

        return service.getAnalytics();
    }
}