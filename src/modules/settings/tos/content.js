import * as Utils from '../../../utils/utils'
import * as ViewUtils from '../../../utils/viewUtils'
const TermsAndConditionsHtml = `<html>
  <head>
    <link href="https://fonts.googleapis.com/css?family=Dosis" rel="stylesheet" />
    <style>
      body {
        padding: 15px;
      }
      p, li {
        font-family: 'Dosis', sans-serif;
        font-size: 16px;
        color: #666;
        margin-bottom: 25px;
        text-align: justify;
        font-weight: normal;
      }
      .title {
        font-weight: 500;
        color: ${ViewUtils.COLOR_THEME_GREEN}
      }
      ol { counter-reset: item; padding:0; margin:0 }
      ol ol {
        margin-top:10px;
      }

      body > ol > li {
        font-size: 18px;
      }

      li { display: block; margin-bottom:10px; }
      li:before { content: counters(item, ".") " "; counter-increment: item }
      li:last-child {
        margin-bottom: 30px;
      }
    </style>
  </head>
  <body>
    <ol>
      <li class="title">ACCEPTANCE OF TERMS
        <p>MicMaps welcomes you to the most innovative way to find open mics in your area, subject to the following Terms of Service, which may be updated, swiftly, at any time, without notice to any of our users. By utilizing the MicMaps services, you accept the Terms of Service and agree to abide by all guidelines applicable to service.</p>
      </li>

      <li class="title">DESCRIPTION OF MICMAPS SERVICES
        <p>MicMaps provides its users with accurate information about nearby open mics, with a mission to become the universal and trusted source of information made for comics by comics. Hosts can publish and promote their mics and performers can seamlessly find a stage, a time, and a place that fits his/her/its schedule.</p>
      </li>

      <li class="title">MEMBER CONDUCT
        <ol>
          <li>We reserve the right to remove your content (mic) from our server if it is deemed
          incorrect or out of date.</li>
          <li>We reserve the right to block and/or terminate any account for abuse, offensive
          content, misleading information or any other reason we decide.</li>
          <li>Failure to abide by the Terms will result in punishment of cooking up to one (1)
          family size serving of Aunt Kathy’s Casserole Recipe.</li>
        </ol>
      </li>


      <li class="title">REGISTRATION OBLIGATIONS
        <ol>
          <li>In consideration of your use of the MicMaps Services, you represent that you are of a legal age to use apps and love comedy.</li>
          <li>You also agree to: (a) provide true, accurate, current, and complete information about the open mic which you submit to MicMaps, and (b) support your fellow comics by not talking loudly during their set or heckling.</li>
        </ol>
      </li>

      <li class="title">AUNT KATHYS CASSEROLE RECIPE
        <ol>
          <li>Take a large casserole pan and pour a ton of beef broth in there.</li>
          <li>Slice nine (9) packages of hot dogs up and let them soak in the brothy mixture for up to eighteen (18) weeks.</li>
          <li>Take three (3) loaves of white bread (sliced, crusts reserved) and throw them in the garbage. You won’t need those.</li>
          <li>Place crusts strategically on top of the now fermented hotdog/broth mixture.</li>
          <li>You may need to use the Nose Closer device (patent pending) due to the smell. It
          won’t be good, we promise.</li>
          <li>Once all ingredients are assembled in the casserole dish, cover, and put the sloshy mixture into the microwave for two hours.</li>
          <li>If your casserole dish is too large for your tiny microwave let sit in the sun on your apartment’s fire escape until golden brown, or up to four (4) days.</li>
          <li>If you choose the Fire Escape Sun method, there is no need to cover the mixture, as the neighborhood feral cats and pigeons will turn their noses up at the vile
          concoction, and not dare to go near it.</li>
          <li>Show finished casserole to your Aunt Kathy and watch as she smiles upon your
          completed creation.</li>
          <li>Do not serve. Not for human consumption.</li>
        </ol>
      </li>

      <li class="title">LYRICS TO HIT SONG “ALL STAR” BY SMASH MOUTH
        <ol>
          <li>Somebody once told me the world was gonna roll me, I ain’t the sharpest tool in the
          shed. She was looking kind of dumb with her finger and her thumb in the shape of
          an “L” on her forehead.</li>
          <li>Well the years start coming and they don’t stop coming, fed to the rules and I hit the
          ground running. Didn’t Make sense not to live for fun. Your brain gets smart but your head gets dumb. So much to do, so much to see, so what’s wrong with taking the back streets. You’ll never know if you don’t go. You’ll never shine if you don’t glow.</li>
          <li>Hey now, you’re an all-star, get your game on, go play. Hey now, you’re a rock star, get the show on, get paid. And all that glitters is gold. Only shooting stars break the mold.</li>
          <li>It’s a cool place and they say it gets colder. You’re bundled up now, wait till you get older. But the meteor men beg to differ, judging by the hole in the satellite picture. The ice we skate is getting pretty thin. The water’s getting warm so we might as well swim. My world’s on fire, how about yours? That’s the way we like it and I never get bored.</li>
          <li>Hey now, you’re an all-star, get your game on, go play. Hey now, you’re a rock star, get the show on, get paid. And all that glitters is gold. Only shooting stars.</li>
          <li>Somebody once asked could I spare some change for gas, I need to get myself away from this place. I said yep what a concept, I could use a little fuel myself, and we could all use a little change.</li>
          <li>Well the years start coming and they don’t stop coming, fed to the rules and I hit the ground running. Didn’t Make sense not to live for fun. Your brain gets smart but your head gets dumb. So much to do, so much to see, so what’s wrong with taking the back streets. You’ll never know if you don’t go. You’ll never shine if you don’t glow.</li>
          <li>Hey now, you’re an all-star, get your game on, go play. Hey now, you’re a rock star, get the show on, get paid. And all that glitters is gold. Only shooting stars break the mold.</p>
        </ol>
      </li>

  </ol>
  </body>
</html>`;



export default TermsAndConditionsHtml;
