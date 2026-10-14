////package com.shipment.notification.repository;
////
////import com.shipment.notification.entity.Notification;
////import org.springframework.data.jpa.repository.JpaRepository;
////
////import java.util.List;
////
////public interface NotificationRepository
////        extends JpaRepository<Notification, Long> {
////
////    List<Notification> findByUserId(Long userId);
////
////    List<Notification> findByIsRead(Boolean isRead);
////}
//package com.shipment.notification.repository;
//
//import com.shipment.notification.entity.Notification;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface NotificationRepository
//        extends JpaRepository<Notification, Long> {
//
//    List<Notification> findByUserId(Long userId);
//
//    List<Notification> findByIsRead(Boolean isRead);
//
//    long countByUserId(Long userId);
//
//    long countByUserIdAndIsReadFalse(Long userId);
//
//    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
//
//    List<Notification> findByShipmentId(Long shipmentId);
//
//    List<Notification> findByUserIdAndIsReadFalse(Long userId);
//}

package com.shipment.notification.repository;

import com.shipment.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserId(Long userId);

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByUserIdAndIsReadFalse(Long userId);

    List<Notification> findByShipmentId(Long shipmentId);

    List<Notification> findByIsRead(Boolean isRead);

    long countByUserId(Long userId);

    long countByUserIdAndIsReadFalse(Long userId);
}