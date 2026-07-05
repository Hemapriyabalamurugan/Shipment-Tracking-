package com.shiptrack.auth.entity.enums;

/**
 * Defines the five roles in the ShipTrack Pro platform.
 * Each role maps to a specific set of permissions enforced via @PreAuthorize.
 */
public enum UserRole {
    CUSTOMER,
    BUSINESS_CLIENT,
    LOGISTICS_OPERATOR,
    SUPPORT_AGENT,
    ADMIN
}
