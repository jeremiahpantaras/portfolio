import BlurText from './BlurText';

// The site's text reveal: BlurText with the settings used on the home page, in three sizes of motion. Words blur in from
// below as the text scrolls into view, one after another. `as` picks the element (a heading, a span, ...). Text only:
// links, buttons and tags stay as they are.
const PRESETS = {
  heading: { delay: 90, stepDuration: 0.55, blur: 10, distance: 26 },
  body: { delay: 28, stepDuration: 0.5, blur: 7, distance: 14 },
  label: { delay: 60, stepDuration: 0.45, blur: 6, distance: 10 },
};

export default function RevealText({ preset = 'body', ...props }) {
  return <BlurText effect="blur" animateBy="words" direction="bottom" staggerFrom="start" trigger="view" threshold={0.2} {...PRESETS[preset]} {...props} />;
}
