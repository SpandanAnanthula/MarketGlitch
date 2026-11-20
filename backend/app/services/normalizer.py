import re
import email.utils
from datetime import datetime
from typing import Optional, Dict, Any, List
from app.services.entity_resolver import resolve_entity_from_text, CANONICAL_ENTITIES

# Standard benchmark exchange rate for standardization: 1 USD = 84.0 INR (1 INR Cr = ~0.119 USD M)
USD_TO_INR_BENCHMARK = 84.0

class DateNormalizer:
    """Standardizes dates across RSS, RFC 2822, ISO, and natural Indian formats into YYYY-MM-DD."""
    
    @staticmethod
    def normalize(date_str: str) -> str:
        if not date_str:
            return datetime.utcnow().strftime("%Y-%m-%d")
        
        date_str = date_str.strip()
        
        # Already YYYY-MM-DD
        if re.match(r'^\d{4}-\d{2}-\d{2}', date_str):
            return date_str[:10]
            
        # RFC 2822 / RSS (e.g. "Mon, 16 Nov 2026 03:42:15 GMT")
        try:
            parsed_tuple = email.utils.parsedate_tz(date_str)
            if parsed_tuple:
                timestamp = email.utils.mktime_tz(parsed_tuple)
                return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")
        except Exception:
            pass

        # Formats like "18 Nov 2026", "November 18, 2026", "18/11/2026"
        patterns = [
            ("%d %b %Y", r'\d{1,2}\s+[A-Za-z]{3}\s+\d{4}'),
            ("%B %d, %Y", r'[A-Za-z]+\s+\d{1,2},\s+\d{4}'),
            ("%d/%m/%Y", r'\d{1,2}/\d{1,2}/\d{4}'),
            ("%Y/%m/%d", r'\d{4}/\d{1,2}/\d{1,2}')
        ]
        for fmt, regex in patterns:
            match = re.search(regex, date_str)
            if match:
                try:
                    dt = datetime.strptime(match.group(0), fmt)
                    return dt.strftime("%Y-%m-%d")
                except Exception:
                    pass

        return datetime.utcnow().strftime("%Y-%m-%d")


class CurrencyNormalizer:
    """
    Standardizes raw text mentions of financial values into both INR Crore (₹ Cr)
    and USD Millions ($M) with standard conversion ratios.
    1 INR Crore = 10,000,000 INR = 0.119 USD Million (at 84 INR/USD)
    1 USD Billion = 1,000 USD Million = 8,400 INR Crore
    """

    @staticmethod
    def normalize(text: str) -> Optional[Dict[str, Any]]:
        if not text:
            return None

        # Pattern 1: ₹X Crore / crore / Cr / cr / Crs (e.g. "₹1,000 crore", "₹14.99 Cr", "336.75 crore")
        inr_cr_match = re.search(r'(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\s*(?:-|to)?\s*([\d,]+(?:\.\d+)?)?\s*(?:crore|cr|crs)\b', text, re.IGNORECASE)
        if inr_cr_match:
            val_str = inr_cr_match.group(2) if inr_cr_match.group(2) else inr_cr_match.group(1)
            try:
                val = float(val_str.replace(',', ''))
                return {
                    "raw_text": inr_cr_match.group(0).strip(),
                    "currency_code": "INR",
                    "inr_cr": round(val, 2),
                    "usd_m": round((val * 10_000_000) / (USD_TO_INR_BENCHMARK * 1_000_000), 2),
                    "formatted_inr": f"₹{val:,.2f} Cr",
                    "formatted_usd": f"${(val * 10) / USD_TO_INR_BENCHMARK:,.2f}M",
                    "scale": "Crore"
                }
            except Exception:
                pass

        # Pattern 2: Lakh Crore (e.g. "₹1.18 lakh crore")
        lakh_cr_match = re.search(r'(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\s*lakh\s*crore\b', text, re.IGNORECASE)
        if lakh_cr_match:
            try:
                lakh_val = float(lakh_cr_match.group(1).replace(',', ''))
                val_cr = lakh_val * 100_000
                return {
                    "raw_text": lakh_cr_match.group(0).strip(),
                    "currency_code": "INR",
                    "inr_cr": round(val_cr, 2),
                    "usd_m": round((val_cr * 10_000_000) / (USD_TO_INR_BENCHMARK * 1_000_000), 2),
                    "formatted_inr": f"₹{val_cr:,.2f} Cr ({lakh_val} Lakh Cr)",
                    "formatted_usd": f"${(val_cr * 10) / USD_TO_INR_BENCHMARK:,.2f}M",
                    "scale": "Lakh Crore"
                }
            except Exception:
                pass

        # Pattern 3: $X Billion / $B (e.g. "$5-6 B", "$5 Billion", "$14.8B")
        usd_b_match = re.search(r'\$\s*([\d,]+(?:\.\d+)?)\s*(?:-|to)?\s*([\d,]+(?:\.\d+)?)?\s*(?:billion|b)\b', text, re.IGNORECASE)
        if usd_b_match:
            val_str = usd_b_match.group(2) if usd_b_match.group(2) else usd_b_match.group(1)
            try:
                val_b = float(val_str.replace(',', ''))
                val_m = val_b * 1000.0
                inr_cr = (val_b * 1_000_000_000 * USD_TO_INR_BENCHMARK) / 10_000_000
                return {
                    "raw_text": usd_b_match.group(0).strip(),
                    "currency_code": "USD",
                    "inr_cr": round(inr_cr, 2),
                    "usd_m": round(val_m, 2),
                    "formatted_inr": f"₹{inr_cr:,.2f} Cr",
                    "formatted_usd": f"${val_b:,.2f}B (${val_m:,.0f}M)",
                    "scale": "Billion USD"
                }
            except Exception:
                pass

        # Pattern 4: $X Million / $M (e.g. "$1,120M", "$184 Million")
        usd_m_match = re.search(r'\$\s*([\d,]+(?:\.\d+)?)\s*(?:million|m)\b', text, re.IGNORECASE)
        if usd_m_match:
            try:
                val_m = float(usd_m_match.group(1).replace(',', ''))
                inr_cr = (val_m * 1_000_000 * USD_TO_INR_BENCHMARK) / 10_000_000
                return {
                    "raw_text": usd_m_match.group(0).strip(),
                    "currency_code": "USD",
                    "inr_cr": round(inr_cr, 2),
                    "usd_m": round(val_m, 2),
                    "formatted_inr": f"₹{inr_cr:,.2f} Cr",
                    "formatted_usd": f"${val_m:,.2f}M",
                    "scale": "Million USD"
                }
            except Exception:
                pass

        return None


class LocationNormalizer:
    """
    Standardizes geographical mentions in Indian industrial text to canonical states,
    districts, and recognized manufacturing clusters.
    """

    KNOWN_CLUSTERS = [
        {"regex": r'\b(?:sanand|dholera|ahmedabad|gujarat)\b', "city": "Sanand / Dholera", "state": "Gujarat", "cluster": "Sanand-Dholera Semiconductor & EV Corridor"},
        {"regex": r'\b(?:sriperumbudur|chennai|hosur|coimbatore|tamil nadu)\b', "city": "Sriperumbudur / Chennai", "state": "Tamil Nadu", "cluster": "Tamil Nadu Electronics & Auto Corridor"},
        {"regex": r'\b(?:noida|greater noida|uttar pradesh|up)\b', "city": "Noida", "state": "Uttar Pradesh", "cluster": "Noida EMC 2.0 Electronics Cluster"},
        {"regex": r'\b(?:bengaluru|bangalore|mysuru|mysore|karnataka)\b', "city": "Bengaluru / Mysuru", "state": "Karnataka", "cluster": "Bengaluru-Mysuru High-Tech Corridor"},
        {"regex": r'\b(?:gurugram|gurgaon|manesar|faridabad|haryana|delhi|ncr)\b', "city": "Gurugram / NCR", "state": "Haryana / NCR", "cluster": "NCR Industrial & Auto Hub"},
        {"regex": r'\b(?:pune|mumbai|maharashtra)\b', "city": "Pune", "state": "Maharashtra", "cluster": "Pune-Chakan Automotive & Industrial Hub"},
        {"regex": r'\b(?:baddi|solan|himachal pradesh|hp)\b', "city": "Baddi", "state": "Himachal Pradesh", "cluster": "Baddi Industrial Hub"}
    ]

    @classmethod
    def normalize(cls, text: str) -> Dict[str, str]:
        if not text:
            return {"city": "Pan-India", "state": "National", "cluster": "All-India Operations", "country": "India"}

        lower = text.lower()
        for c in cls.KNOWN_CLUSTERS:
            if re.search(c["regex"], lower):
                return {
                    "city": c["city"],
                    "state": c["state"],
                    "cluster": c["cluster"],
                    "country": "India"
                }

        return {"city": "Pan-India", "state": "National", "cluster": "National Industrial Scope", "country": "India"}


class UnifiedDocumentNormalizer:
    """
    Stage 3 Normalizer: Takes raw collected records from any source
    and produces the standardized Common Document Envelope.
    """

    @classmethod
    def normalize_document(cls, raw_doc: dict) -> dict:
        title = raw_doc.get("title") or raw_doc.get("raw_title") or ""
        text = raw_doc.get("text_extract") or title or ""
        url = raw_doc.get("url") or raw_doc.get("source_url") or ""
        publisher = raw_doc.get("publisher") or raw_doc.get("source_name") or "Public Record"

        # Check for nested payload metadata
        tender_data = raw_doc.get("tender_data") or {}
        policy_data = raw_doc.get("policy_data") or {}
        patent_data = raw_doc.get("patent_data") or {}
        trade_data = raw_doc.get("data_payload") or {}

        # 1. Date standardization
        raw_date = raw_doc.get("published_at") or raw_doc.get("published_date") or tender_data.get("published_date") or policy_data.get("date_notified") or ""
        standardized_date = DateNormalizer.normalize(raw_date)

        # 2. Currency standardization
        combined_text_for_currency = f"{title} {text} {policy_data.get('summary', '')} {policy_data.get('title', '')}"
        financials = CurrencyNormalizer.normalize(combined_text_for_currency)

        # Tender explicit financial override if not caught in title
        if not financials and tender_data.get("approx_value_inr_cr"):
            val_cr = float(tender_data["approx_value_inr_cr"])
            financials = {
                "raw_text": f"₹{val_cr} Cr",
                "currency_code": "INR",
                "inr_cr": round(val_cr, 2),
                "usd_m": round((val_cr * 10) / USD_TO_INR_BENCHMARK, 2),
                "formatted_inr": f"₹{val_cr:,.2f} Cr",
                "formatted_usd": f"${(val_cr * 10) / USD_TO_INR_BENCHMARK:,.2f}M",
                "scale": "Crore"
            }
        elif not financials and trade_data.get("annual_import_usd_b"):
            val_b = float(trade_data["annual_import_usd_b"])
            val_m = val_b * 1000.0
            inr_cr = (val_b * 1000.0 * 10) / (USD_TO_INR_BENCHMARK / 84.0) * (84.0 / 10.0)
            inr_cr_total = val_b * 1000.0 * USD_TO_INR_BENCHMARK / 10.0
            financials = {
                "raw_text": f"${val_b}B",
                "currency_code": "USD",
                "inr_cr": round(inr_cr_total, 2),
                "usd_m": round(val_m, 2),
                "formatted_inr": f"₹{inr_cr_total:,.2f} Cr",
                "formatted_usd": f"${val_b:,.2f}B",
                "scale": "Billion USD"
            }

        # 3. Location standardization
        loc_str = str(tender_data.get("location", "")) + " " + title + " " + text + " " + str(patent_data.get("applicant", ""))
        location_meta = LocationNormalizer.normalize(loc_str)

        # 4. Entity resolution & alias standardization
        entity_resolved = resolve_entity_from_text(title + " " + text + " " + str(patent_data.get("applicant", "")))
        entity_id = raw_doc.get("entity_id")
        entity_name = raw_doc.get("entity_name")
        if entity_resolved:
            entity_id = entity_resolved["entity_id"]
            entity_name = entity_resolved["canonical_name"]

        # 5. Event classification
        event_type = raw_doc.get("event_type")
        if not event_type:
            if tender_data:
                event_type = "tender"
            elif policy_data:
                event_type = "policy"
            elif patent_data:
                event_type = "patent"
            elif trade_data:
                event_type = "trade"
            else:
                event_type = "general_industry"

        return {
            "envelope_id": f"env_{raw_doc.get('content_hash', 'gen')}",
            "source_id": raw_doc.get("source_id", "src_general"),
            "publisher": publisher,
            "url": url,
            "published_date": standardized_date,
            "normalized_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "entity": {
                "canonical_id": entity_id or "unassigned",
                "canonical_name": entity_name or "Indian Electronics Ecosystem",
                "resolved": bool(entity_resolved)
            },
            "event_type": event_type,
            "title": title.strip(),
            "financials": financials,
            "geography": location_meta,
            "facts": [
                f"Publisher: {publisher}",
                f"Reported Date: {standardized_date}",
                f"Location Cluster: {location_meta['cluster']}",
                f"Financial Scale: {financials['formatted_inr'] if financials else 'Non-financial / unstated capex'}"
            ],
            "evidence_snippet": title.strip(),
            "confidence_rating": "High" if financials or entity_resolved else "Medium"
        }
