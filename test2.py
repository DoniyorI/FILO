from Google import Create_Service
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

clientSecret = "client_secret.json"
apiName = 'gmail'
apiVersion = "v1"
scopes = ['https://mail.google.com/']

service = Create_Service(clientSecret, apiName, apiVersion, scopes)

mimeMsg = MIMEMultipart()
emailMsg = "HIIII"

mimeMsg["to"] = "zodin.thanga9@gmail.com"
mimeMsg["subject"] = "HI"
mimeMsg.attach(MIMEText(emailMsg, 'plain'))
raw_string = base64.urlsafe_b64encode(mimeMsg.as_bytes()).decode()

message = service.users().messages().send(userId='me', body={'raw': raw_string}).execute()
print(message)
