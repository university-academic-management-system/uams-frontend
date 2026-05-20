import { Link, useSearchParams } from "react-router";
import { Toaster, toaster } from "../components/ui/toaster";
import apiClient from "../services/api";
import { useEffect, useMemo, useState } from "react";
import {
  AbsoluteCenter,
  Button,
  Spinner,
  Stack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { LucideCheckCircle, LucideXCircle } from "lucide-react";

const PaymentVerificationPage = () => {
  // get payment status on mount to update hasPaid state
  const [sq, _] = useSearchParams();
  const trxRef = useMemo(() => sq.get("trxref"), [sq]);
  const reference = useMemo(() => sq.get("reference"), [sq]);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

  const paymentCallbackUrl = useMemo(
    () => localStorage.getItem("paymentCallbackUrl") || "",
    []
  );

  // handle successful id card payment
  useEffect(() => {
    if (trxRef || reference) {
      apiClient
        .post("/payment/verify", {
          reference: trxRef || reference,
        })
        .then((res) => {
          if (res.data.success) {
            toaster.success({ description: "Payment verified successfully!" });
            setVerificationStatus("success");
          }
        })
        .catch(() => {
          toaster.error({ description: "Payment verification failed!" });
          setVerificationStatus("failed");
        });
    }
  }, [trxRef]);

  if (verificationStatus === "pending") {
    return (
      <AbsoluteCenter>
        <Text>
          Verifying payment... <Spinner />
        </Text>

        <Toaster />
      </AbsoluteCenter>
    );
  }

  if (verificationStatus === "failed") {
    return (
      <AbsoluteCenter>
        <Stack gap="4" justify="center" align="center">

          <div style={{ alignSelf: "center" }}>
            <LucideXCircle size={64} color="red" />
          </div>

          <Heading size="2xl" color="red" alignSelf="center">
            Payment Verification failed
          </Heading>

          <Link to={paymentCallbackUrl || "/"}>
            <Button className="bg-black text-white p-4 rounded-md">
              Go back
            </Button>
          </Link>
        </Stack>
        <Toaster />
      </AbsoluteCenter>
    );
  }

  return (
    <AbsoluteCenter>
      <Stack gap="4" justify="center" align="center">

        <div style={{ alignSelf: "center" }}>
          <LucideCheckCircle size={64} color="green" />
        </div>

        <Heading
          className="font-bold text-lg text-center"
          size="2xl"
          alignSelf="center"
        >
          Payment Verification Successful
        </Heading>

        <Link to={paymentCallbackUrl || "/"}>
          <Button className="bg-black text-white p-4 rounded-md">
            Continue
          </Button>
        </Link>
      </Stack>

      <Toaster />
    </AbsoluteCenter>
  );
};

export default PaymentVerificationPage;
