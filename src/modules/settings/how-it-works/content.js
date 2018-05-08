import * as Utils from '../../../utils/utils'
import * as ViewUtils from '../../../utils/viewUtils'

const TermsAndConditionsHtml = `
<html>
  <head>
    <link href="https://fonts.googleapis.com/css?family=Dosis" rel="stylesheet" />
    <style>
      body {
        padding: 15px;
      }
      h1 {
        font-size: 24px;
        font-family: 'Dosis', sans-serif;
        font-weight: normal;
        color: ${ViewUtils.COLOR_THEME_GREEN}
      }
      h2 {
        font-size: 20px;
        font-family: 'Dosis', sans-serif;
        font-weight: normal;
        color: ${ViewUtils.COLOR_THEME_GREEN}
      }
      p {
        font-family: 'Dosis', sans-serif;
        font-size: 16px;
        color: #666;
        text-align: justify;
      }
      p.title {
        font-weight: 500;
      }
    </style>
  </head>
  <body>

    <h1>Using MicMaps is easy!</h1>

    <h2>Are you a comic looking for stage time?</h2>
    <p>Simply make sure you have you location services activated for this app so we can show you the nearby open mics in your area. Boom! Its that simple.
    The map will show you all the mics nearby that are happening today.<p>
    <p>If you want to see whats happening in your area the rest of the week, simply choose a different day from the top bar.</p>
    <p>If the map view is too confusing, just tap the "list" button on the top left corner of your screen.</p>
    <p>If you're still having trouble figuring out how to use this app, feel free to email us or feel free to quit comedy.</p>

    <h2>Are you a host?</h2>
    <p>If the answer is yes, then you have come to the right place. MicMaps is the fastest growing and most trusted source of open mic information made for comics by comics. Sharing your mic listings here is simple. Just tap the "submit a mic" button at the bottom of the map screen. Fill in the form with all your accurate mic details and then tap submit. Voila!!! Your mic will be reviewed by the MicMaps, approved, and live on our app within 24 hours. You can share it to face book or twitter or text it to your dad. If you're still having trouble posting your mic with us, feel free to contact us directly and a super hot and friendly girl will help guide you through the process.</p>

    <p>We hope you find all this helpful. If you didn't, feel free to contact us with some suggestions on how we can improve our services.<p>
  </body>
</html>`;

export default TermsAndConditionsHtml;
