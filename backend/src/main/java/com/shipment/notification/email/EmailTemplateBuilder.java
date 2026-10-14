package com.shipment.notification.email;

public class EmailTemplateBuilder {

    public static String buildShipmentEmail(
            String customerName,
            String trackingNumber,
            String status,
            String message
    ) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>

                <body style="
                    margin:0;
                    padding:40px;
                    background:#f4f7fb;
                    font-family:Arial,Helvetica,sans-serif;
                ">

                <table align="center"
                       width="650"
                       style="
                           background:white;
                           border-radius:12px;
                           overflow:hidden;
                           box-shadow:0 4px 18px rgba(0,0,0,.08);
                       ">

                    <tr>
                        <td style="
                            background:#2563eb;
                            color:white;
                            padding:25px;
                            text-align:center;
                            font-size:28px;
                            font-weight:bold;
                        ">
                            🚚 ShipTrack Pro
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:35px;">

                            <h2 style="margin-top:0;color:#1e293b;">
                                Hello %s,
                            </h2>

                            <p style="
                                color:#475569;
                                font-size:16px;
                                line-height:1.7;
                            ">
                                %s
                            </p>

                            <table
                                width="100%%"
                                cellpadding="10"
                                style="
                                    margin-top:25px;
                                    border:1px solid #e5e7eb;
                                    border-collapse:collapse;
                                ">

                                <tr>
                                    <td><b>Tracking Number</b></td>
                                    <td>%s</td>
                                </tr>

                                <tr>
                                    <td><b>Status</b></td>
                                    <td>
                                        <span style="
                                            background:#dbeafe;
                                            color:#2563eb;
                                            padding:6px 14px;
                                            border-radius:30px;
                                            font-weight:bold;
                                        ">
                                            %s
                                        </span>
                                    </td>
                                </tr>

                            </table>

                            <div style="text-align:center;margin-top:35px;">

                                <a href="http://localhost:5173/app/track"
                                   style="
                                        background:#2563eb;
                                        color:white;
                                        text-decoration:none;
                                        padding:14px 28px;
                                        border-radius:8px;
                                        display:inline-block;
                                        font-weight:bold;
                                   ">
                                   Track Shipment
                                </a>

                            </div>

                        </td>
                    </tr>

                    <tr>
                        <td style="
                            background:#f8fafc;
                            color:#64748b;
                            text-align:center;
                            padding:20px;
                            font-size:13px;
                        ">
                            © 2026 ShipTrack Pro<br>
                            Smart Logistics Platform
                        </td>
                    </tr>

                </table>

                </body>
                </html>
                """.formatted(
                customerName,
                message,
                trackingNumber,
                status
        );
    }
}