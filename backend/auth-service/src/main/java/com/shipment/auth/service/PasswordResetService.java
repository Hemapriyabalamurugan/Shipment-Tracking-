//package com.shipment.auth.service;
//public interface PasswordResetService {
//
//    void forgotPassword(
//            ForgotPasswordRequest request
//    );
//
//    void verifyResetOtp(
//            VerifyResetOtpRequest request
//    );
//
//    void resetPassword(
//            ResetPasswordRequest request
//    );
//}
package com.shipment.auth.service;

import com.shipment.auth.dto.request.ForgotPasswordRequest;
import com.shipment.auth.dto.request.ResetPasswordRequest;
import com.shipment.auth.dto.request.VerifyResetOtpRequest;

public interface PasswordResetService {

    void forgotPassword(
            ForgotPasswordRequest request
    );

    void verifyResetOtp(
            VerifyResetOtpRequest request
    );

    void resetPassword(
            ResetPasswordRequest request
    );
}