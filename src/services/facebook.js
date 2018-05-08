const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} = FBSDK;

export function login(permissions = ['email', 'public_profile']) {

  logout();
  return new Promise((resolve, reject) => {
    LoginManager.logInWithReadPermissions(permissions).then(
      function fbloginresult(loginResult) {
        if (loginResult.isCancelled) {
          reject('Login was cancelled');
        }
        else {
          AccessToken.getCurrentAccessToken().then(tokenData => {
            const accessToken = tokenData.accessToken.toString();
            const infoRequest = new GraphRequest('/me?fields=id,first_name,last_name,email', null, (profileError, profileResult) => {
              if (profileError) {
                reject(profileError.toString());
              }
              else {
                resolve({profile: profileResult, token: accessToken});
              }
            });
            new GraphRequestManager().addRequest(infoRequest).start();
          }).catch(tokenError => reject(tokenError));
        }
      }).catch(loginError => reject('' + loginError));
  });
}

export function logout() {
  LoginManager.logOut();
}
