import { google } from 'googleapis';

const KEY = {
  type: 'service_account',
  project_id: 'amq-321901',
  private_key_id: 'e7f31ec4e7bbb24342b8e7ba29af0dfd88be0cf3',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCWT8S+OytCX6dL\nzUkN0S70nwxTvVjyiHQmJzYSJ/FhU72qc41oakWSYj4eJAtcaXDUDewOyYq4Ys1D\nA3Nz+mh8txuYOwAdB8Vk7jJs+POLQEWcacG5HqmXE7sFyt8pr+iYmFhYBEiceuST\n4WwNdzXjZaHhaAloKEhHS+P/cE+vBxYX/jJWo9dXklNgaLL5tLbicrH4RssiPGvy\nVUt9wPljpLix2fXvHuW8m4g+P2YP5+Xg3xzXscxtcFjuP+askXmP9hT3ShlqtHNY\nPOU+vJiMWdWFFh/qUkPrCo1VDrifiBmtzQDbVnatxxMejR3NOJeCuQl44hQ8OLMz\nNPLWBQDzAgMBAAECgf8J2m6ViFQ+6yDIsQp8994/bpGysLy/5aqoydeVasJErb/7\n/5coCTB6kUWM7xx0U3gU6h5IsKzFb2gcwaGSEEUP0FIiEnhfP7k7KypAe/PlCabh\nwDwZAP4oxdjGQc/R+nhB7JRrNodXChhngbqoKkLcmXSt03lpSNyOkh59ee4ABrtL\ncW/eG2T44LTrWzp0TUTtTraFPIQ36iSrCU/N9gKwv0atDF+ZpbEHT6Vo7lkSbDul\nDObVzQsBRWLqiEbz6VXZP6nYvGaFuSnrhq9UBCQOdezz6JXWpyP5PhndR3r0I6IH\nCrz11qUk6sFgBsTKEvZFS2ExjyzBQXMQvQpn6GECgYEAz5r4LL6kks9C3Jsh36Ag\nZa4aYWdsa3MT89ywU5JQRH0zk6vd4JEKheiOSgpbNPu6CIqNTIeXirzCGZnhumEm\nGLpW6y/fkbD2MDGeVMQHnE/C6osRfxXMpTIDmPfD8k34vR/42FhJMVaFflskWJQB\nuwPNsKi70iONm8fw+IDZJ+8CgYEAuVm+itkqyc/oAC2FGTgRK4WsXE7+zsBtpebk\nv/Uh0YngHxguWrqyHcKnEj1SfojFyx+sXwi3HkA63RZ8A2dm+6OurAHZb0UuXDr0\nuRoYQ16MUeiPLoIo1VdNtNZDlpRiSu5+IipMzX7miD3LkuefpteWjgldqEMyfohP\nr7bsUz0CgYEAxY6mDgZZG++po77ojCKX0crNBdXigZmf6hcfoFeClLpEA4mweYvs\nZKN6DBEw3AmT7Z7TeXkqh3a6ipw6Bx99nlhscCA9cyngDNqa3fUxfNkWFhXCz5nS\nBX3DmKRmTcVPJ8IuDsps1EuOe0CGJNirkOi8qxjWqtD0Z8Lrl78dZvcCgYAXIP3H\n8cWHHWyD6So8tWRfG/UgJ7NgNV75XtCYq4wmy5+uAaR3KejkEdArVH+gzoxwBmnK\nChpfqgAuaonbGuIc8JXxXOG3ItjgJXM4TetNLNUxu2VylkdmJ9jIghw5BBcn5o7S\n0Jh45Cb8RUnL8R9ZAHoHC2AmiQwaAgR/lsHyuQKBgQDNRCe97ujQ61jg7gKnm7LE\nrGmtFJWvskHTAoSdvx+6dI6cp2JYuz5ZdMeE3J0Gu0sGhy1Han9gBVC1uD3HsbsS\nMOVl7xg7hTbXHQ64Ify7PtHFJiQyMB5yosc3QEIZhYrM7md8TRY+1sfVzwcSyrVB\n7pMpwPBP3j4ztt+ugelhIw==\n-----END PRIVATE KEY-----\n',
  client_email: 'a-name-41@amq-321901.iam.gserviceaccount.com',
  client_id: '116302606340235073054',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/a-name-41%40amq-321901.iam.gserviceaccount.com',
};

async function getDatabase() {
  // Use the read only service account to authenticate
  const sheets = google.sheets('v4');
  const auth = google.auth.fromJSON(KEY);
  auth.scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

  // Pull the database from the spreadsheet
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '1i-3PZDh6ug9L_NY1gCmWyyZZ24D-7uQoDxb9bf6ruEM',
    range: '1629689434944',
    auth,
  });

  // Build a dictionary from Links corresponding to Anime
  let database = {};
  for (const row of response.data.values) database[row[4]] = row[0];
  return database;
}

export default getDatabase;
