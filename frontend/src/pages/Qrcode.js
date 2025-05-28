import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = () => {
  const paymentUrl =
    "upi://pay?pa=makhansingh79731@oksbi&pn=Makhansingh&cu=INR";

  return (
    <div>
      <h3>Scan to Pay</h3>
      <QRCodeCanvas value={paymentUrl} size={100} />
    </div>
  );
};

export default QRCodeGenerator;
