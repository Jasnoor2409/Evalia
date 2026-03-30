import pandas as pd

# Load dataset
df = pd.read_csv("opportunities_500_dataset.csv")

# Map company → domain
company_domains = {
    "Google": "google.com",
    "Microsoft": "microsoft.com",
    "Amazon": "amazon.com",
    "Flipkart": "flipkart.com",
    "Infosys": "infosys.com",
    "TCS": "tcs.com",
    "Wipro": "wipro.com",
    "Accenture": "accenture.com",
    "Paytm": "paytm.com",
    "Zomato": "zomato.com",
    "Uber": "uber.com",
    "Adobe": "adobe.com",
    "Oracle": "oracle.com",
    "IBM": "ibm.com",
    "Capgemini": "capgemini.com",
    "Deloitte": "deloitte.com",
    "Samsung": "samsung.com",
    "Intel": "intel.com",
    "Nvidia": "nvidia.com",
    "Cisco": "cisco.com"
}

# Create logo column
def get_logo(company):
    domain = company_domains.get(company, "google.com")
    return f"https://logo.clearbit.com/{domain}"

df["logo"] = df["company"].apply(get_logo)

# Save updated dataset
df.to_csv("opportunities_500_dataset.csv", index=False)

print("Logos added successfully!")