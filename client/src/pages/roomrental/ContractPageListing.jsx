// src/pages/roomrental/ContractPageListing.jsx
import React, { useEffect, useContext, useState } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function ContractPageListing() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const todayIso = new Date().toISOString().slice(0, 10);
  const ownerName = user?.name || user?.email || "Owner";
  const ownerPhone = user?.phone || "N/A";

  const handleAgree = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    sessionStorage.setItem("listingContractAgreed", new Date().toISOString());

        // Build request payload
    const payload = {
      acknowledgedAt: new Date().toISOString(),
      acknowledgedByName: ownerName,
      meta: {
        // optional metadata; include user id/email if available
        userEmail: user?.email,
        userId: user?.id || user?._id || null,
      },
    };

    // Try to save acknowledgement to backend (non-blocking)
    try {
      const base = process.env.REACT_APP_API_BASE || "";
      const res = await fetch(`${base}/api/roomrental/acknowledge-contract`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || `Server responded ${res.status}`);
      }
    } catch (err) {
      console.warn("Acknowledgement save failed:", err);
      setError(
        "We were unable to save your acknowledgement to the server. Your agreement is stored locally."
      );
    } finally {
      // Attempt to close the window; if blocked, navigate to the listing flow
      const fallbackRoute = "/room-listing-request";
      const tryClose = () => {
        try {
          if (window.opener) {
            window.close();
            setTimeout(() => {
              if (!window.closed) nav(fallbackRoute, { replace: true });
            }, 300);
            return;
          }

          window.close();
          setTimeout(() => {
            if (!window.closed) nav(fallbackRoute, { replace: true });
          }, 300);
        } catch (e) {
          nav(fallbackRoute, { replace: true });
        } finally {
          setSaving(false);
        }
      };
      tryClose();
    }
  };

  return (
    <Container style={{ maxWidth: 900, marginTop: 30, marginBottom: 60 }}>
      <h2>Listing Agreement — LM-Ltd Services and Owner</h2>
      <p>
        <strong>Effective date:</strong> <em>{todayIso}</em>
      </p>
      <p>
        <strong>Owner:</strong> <em>{ownerName}</em>
      </p>
      <p>
        <strong>Phone:</strong> <em>{ownerPhone}</em>
      </p>
      <section style={{ marginTop: 20 }}>
        <h4>Term</h4>
        <p>
          Owner selects <strong>1 (13.5%) / 3 (10.5%) / 6 (8.5%) months</strong>{" "}
          (circle one). The selected term governs the initial duration of this
          Listing Agreement.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Fees and payment</h4>
        <p>
          Owner agrees to pay the commission percentage or one‑time fee
          described in the chosen plan. For hybrid plans, an upfront listing fee
          of <strong>$20 × months</strong> is charged at listing start;
          commission applies to rent collected.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Billing timing</h4>
        <p>
          Per‑booking commissions are charged at the time of each rent
          collection. One‑time fees are charged at listing start. Processing
          fees are passed through as applicable.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Payouts to owner</h4>
        <p>
          Platform remits owner payouts <strong>7 days</strong> after confirmed
          check‑in/receipt. The exact payout timing will be displayed in the
          owner's payout settings.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Refunds and prorating</h4>
        <p>
          If owner terminates early, fees are prorated on a daily basis for the
          unused portion; platform retains fees for services rendered. Platform
          may withhold refunds for unresolved disputes or outstanding
          chargebacks.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Cancellations and disputes</h4>
        <p>
          Cancellation rules follow the published cancellation policy. Disputes
          must be submitted within 3 days of checkout.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Taxes and compliance</h4>
        <p>
          Owner is responsible for local lodging taxes unless platform is
          contracted to collect and remit them. Platform will display taxes at
          checkout where required by law.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Damage and security deposits</h4>
        <p>
          Platform may require a card pre‑authorization or hold for incidental
          damages; capture will occur only on validated claims.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Data and privacy</h4>
        <p>
          Platform will process owner and guest data in accordance with its
          privacy policy.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Termination and renewal</h4>
        <p>
          This Agreement auto‑renews unless either party gives 30 days' notice
          prior to the term end.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Governing law and dispute resolution</h4>
        <p>
          This Agreement is governed by the laws of Luanda, Angola. Any disputes
          will be resolved under those laws.
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Signatures</h4>
        <p>
          By clicking <strong>Agree and Acknowledge</strong>, the Owner
          digitally agrees to and acknowledges the terms of this Listing
          Agreement.
        </p>
      </section>

      {error && <Alert variant="warning">{error}</Alert>}

      <div className="d-flex justify-content-end" style={{ marginTop: 24 }}>
        <Button variant="primary" onClick={handleAgree} disabled={saving}>
          {saving ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Saving...
            </>
          ) : (
            "Agree and Acknowledge"
          )}
        </Button>
      </div>
      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones")}:</strong> (+244) 222 022 351;
            (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address")}
          </p>
          &copy; {new Date().getFullYear()} LM-Ltd Services.{" "}
          {t("whoWeAre.footer.copyright")}
        </small>
      </footer>
    </Container>
  );
}