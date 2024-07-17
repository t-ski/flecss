<a href="https://github.com/t-ski/flecss/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/t-ski/flecss/test.yml?label=test&logo=github" alt="GitHub Test"></a>
&hairsp;
<a href="https://www.npmjs.com/package/flecss"><img src="https://img.shields.io/npm/v/flecss?logo=npm" alt="NPM"></a>
&hairsp;
<a href="https://sass-lang.com/"><img src="https://img.shields.io/badge/SCSS-%20?label=CSS&labelColor=blue&color=orchid" alt="CSS/SCSS"></a>

**flecss** (pron. ‘_flex_’): Simple and minimalist CSS framework utilising the power of flexbox.

<a href="https://github.com/t-ski/flecss">
  <img src="./readme/flecss-logo.svg" width="200">
</a><br><br>

Unlike _Bootstrap_ or _Tailwind_, flecss is not as granular as CSS itself. Instead, it follows a minimal approach: Each class bases on a style requirement common for the majority of web-based designs <sup>1</sup>. Anything else is left to individual stylesheets.

> 📦 flecss ships with a total of &#8232;`7kB`, compared to Bootstrap with `248kB` <sup>2</sup>.

[1. Integration](#integration)  
[2. Classes](#classes)  
&emsp; [2.1 `.c` Condition](#c-condition)  
&emsp; [2.2 `.f` Flex](#f-flex)  
&emsp; [2.3 `.m` Margin](#m-margin)  
&emsp; [2.4 `.p` Padding](#p-padding)  
&emsp; [2.5 `.s` Section + `.w` Wrapper](#s-section--w-wrapper)  
&emsp; [2.6 `.t` Text](#t-text)  
&emsp; [2.7 `.v` Viewport](#v-viewport)  
[3. Modifiers](#modifiers)  
&emsp; [3.1 Space](#space)  
[4. Build Interface](#build-interface)  
[5. Mixins](#mixins)  
&emsp; [5.1 Breakpoint](#breakpoint)  
&emsp; [5.2 Color](#colour)  
&emsp; [5.3 Theme](#theme)  

## Integration

#### From CDN

``` html
<link rel="stylesheet" href="https://unpkg.com/flecss/dist/flecss.css">
```

#### From NPM

``` cli
npm install -D flecss
```

> ℹ️ Certain CSS resets are inherent to a flecss integration (see [_reset.scss](./src/_reset.scss)). 

#### Get Started

The flecss class anatomy consists of a purposeful classifier `A`, and possibly a specifier `B`: `.A_B`. An unspecific class – i.e. without a specifier suffix – represents the default style. Each class also associates with a handy shorthand classifier.

> ℹ️ Unlike for _BEM_, specific classes are standlone, i.e. inherit all shared style foundations. It is thus not required to assign the joint default and specific class name <sub>`❌ .p.p_top` `✅ .p_top`</sub>.

#### Example

``` html
<section>
  <div class="wrapper">
    <h1>flecss</h1>
  </div>
</section>
<section class="section">
  <div class="wrapper">
    <h2 class="viewport_not-s">About</h2>
    <p class="padding text_center">
      flecss is a modern and simple CSS framework.
    </p>
    <a class="margin--l margin_top" href="/try">Try</a>
  </div>
</section>
```

## Classes

### `.c` `.condition`

The **condition** class represents toggleable layout conditions. At that, the explicit class describes the less common condition, whereas absence implies the complementary (common) condition.

**` _disable`** &emsp; **Greyout and disable for interaction.**  
**`    _hide`** &emsp; **Hide, but keep layout.**  
**`_collapse`** &emsp; **Hide, including layout (bounding box).**  

| &emsp; | `_disable` | `_hide` | `_collapse` |
| - | - | - | - |
| <img src="./readme/c-condition-none.svg" width="145"> | <img src="./readme/c-condition_disable.svg" width="145"> | <img src="./readme/c-condition_hide.svg" width="145"> | <img src="./readme/c-condition_collapse.svg" width="145"> |

#### Example

``` html
<button class="c--disable">Submit</button>
```

### `.f` `.flex`

The **flex** class is the key layouting class in flecss. It allows for a number of flexbox-based content arrangements.

**` _1`** - **`_9`** &emsp; **`n` equal-sized content tiles per row with a homogeneous margin in between.**  

| `_1` | `_2` | `_3` |
| - | - | - |
| <img src="./readme/f-flex_1.svg" width="145"> | <img src="./readme/f-flex_2.svg" width="145"> | <img src="./readme/f-flex_3.svg" width="145"> |

#### Example

``` html
<div class="f_2">
  <img src="/assets/event.png">
  <p>Panel on web technologies.</p>
</div>
```

### `.m` `.margin`

The **margin** class simply induces a margin to the respective element.

**<sup>`   `</sup> <sup>`        default`</sup>** &emsp; **Margin to all sides.**  
**`_h` `_horizontal`** &emsp; **Margin to top and bottom sides.**  
**`_v` `  _vertical`** &emsp; **Margin to left and right sides.**  
**`_t` `       _top`** &emsp; **Margin to top side only.**  
**`_b` `    _bottom`** &emsp; **Margin to bottom side only.**  
**`_l` `      _left`** &emsp; **Margin to left side only.**  
**`_r` `     _right`** &emsp; **Margin to right side only.**  

| <sup>`default`</sup> | `_horizontal` | `_vertical` | `_top` | `_bottom` | `_left` | `_right` |
| - | - | - | - | - | - | - |
| <img src="./readme/m-margin.svg" width="145"> | <img src="./readme/m-margin_horizontal.svg" width="145"> | <img src="./readme/m-margin_vertical.svg" width="145"> | <img src="./readme/m-margin_top.svg" width="145"> | <img src="./readme/m-margin_bottom.svg" width="145"> | <img src="./readme/m-margin_left.svg" width="145"> | <img src="./readme/m-margin_right.svg" width="145"> |

#### Example

``` html
<h2 class="p_b">Event</h2>
<p>Panel on web technologies.</p>
```

### `.p` `.padding`

The **padding** class simply induces a padding to the respective element.

**<sup>`   `</sup> <sup>`        default`</sup>** &emsp; **Padding to all sides.**  
**`_h` `_horizontal`** &emsp; **Padding to top and bottom sides.**  
**`_v` `  _vertical`** &emsp; **Padding to left and right sides.**  
**`_t` `       _top`** &emsp; **Padding to top side only.**  
**`_b` `    _bottom`** &emsp; **Padding to bottom side only.**  
**`_l` `      _left`** &emsp; **Padding to left side only.**  
**`_r` `     _right`** &emsp; **Padding to right side only.**  
 
| <sup>`default`</sup> | `_horizontal` | `_vertical` | `_top` | `_bottom` | `_left` | `_right` |
| - | - | - | - | - | - | - |
| <img src="./readme/p-padding.svg" width="145"> | <img src="./readme/p-padding_horizontal.svg" width="145"> | <img src="./readme/p-padding_vertical.svg" width="145"> | <img src="./readme/p-padding_top.svg" width="145"> | <img src="./readme/p-padding_bottom.svg" width="145"> | <img src="./readme/p-padding_left.svg" width="145"> | <img src="./readme/p-padding_right.svg" width="145"> |

#### Example

``` html
<div class="p">
  <h2>Event</h2>
</div>
```

### `.s` `.section` + `.w` `.wrapper`

The **section** and **wrapper** class describe common vertical layouting containers. A section stretches across the full width, with a small affixed vertical content padding. The wrapper has a limited width and is centered within a section, with an extra large affixed horizontal content padding. Used in combination, the section-wrapper layouting classes provide a simple yet powerful tool.

| `.s` | `.w` | `.s` `>` `.w` |
| - | - | - |
| <img src="./readme/s-section.svg" width="145"> | <img src="./readme/w-wrapper.svg" width="145"> | <img src="./readme/s-section--w-wrapper.svg" width="145"> |

> `--wrapper-width`: `1420px`

#### Example

``` html
<section class="section">
  <div class="wrapper">
    <h2>Event</h2>
  </div>
</div>
```

### `.t` `.text`

The **text** class helps with applying deviant text formatting.

**`_l` `   _left`** &emsp; **Align text to the left.**  
**`_r` `  _right`** &emsp; **Align text to the right.**  
**`_c` ` _center`** &emsp; **Align text to the center.**  
**`_j` `_justify`** &emsp; **Align text across the whole width.**  

| `_left` | `_right` | `_center` | `_justify` |
| - | - | - | - |
| <img src="./readme/t-text_left.svg" width="145"> | <img src="./readme/t-text_right.svg" width="145"> | <img src="./readme/t-text_center.svg" width="145"> | <img src="./readme/t-text_justify.svg" width="145"> |

#### Example

``` html
<p class="t_center">
  Panel on web technologies.
</p>
```

### `.v` `.viewport`

The **viewport** class enables .

**`    _s` `     _small`** &emsp; **Show on small viewport only.**  
**`    _m` `    _medium`** &emsp; **Show on medium viewport only.**  
**`    _l` `     _large`** &emsp; **Show on large viewport only.**  
**`_not-s` ` _not-small`** &emsp; **Do not show on small viewport.**  
**`_not-m` `_not-medium`** &emsp; **Show on medium viewport only.**  
**`_not-l` ` _not-large`** &emsp; **Show on large viewport only.**  

| `_large` | `_not-large` |
| - | - |
| <img src="./readme/v-viewport_large.svg" width="145"> | <img src="./readme/v-viewport_not-large.svg" width="145"> |

#### Breakpoints

> Breakpoint `l`: `1 × --wrapper-width` = `1420px`  
> Breakpoint `m`: `⅔ × --wrapper-width` = `~947px`  
> Breakpoint `s`: `⅓ × --wrapper-width` = `~473px`  

> Breakpoints are not mutable, i.e. overriding `--wrapper-width` does not affect the breakpoints.

#### Example

``` html
<div class="p p--large">
  <h2>Event</h2>
</div>
```

## Modifiers

Instead of a specifier, a double dash indicated modifier `C` can be used to override a variable style property: `.A--C`. Each modifier is therefore linked with global SCSS variable.

> ℹ️ Modifiers simply override a certain variable. They are in fact not standalone like specified classed. Like for _BEM_, it is thus required to assign the joint class and modified class name <sub>`❌ .p--large` `✅ .p.p--large`</sub>.

### Space

The space modifier describes a space unit that applies with all area space-related classes. For instance, using `.m m--large` would result in subsequently larger margin compared to just `.m` (which equals `.m .m--medium`).

**`--xs` `--extra-small`** &emsp; **Extra small spacing.**  
**` --s` `      --small`** &emsp; **Small spacing.**  
**` --m` `     --medium`** &emsp; **Medium spacing <sup>`default`</sup>.**  
**` --l` `      --large`** &emsp; **Large spacing.**  
**`--xl` `--extra-large`** &emsp; **Extra large spacing.**  

The size of a space unit (e.g. `--s`) scales progressively aroud the `--m` (≡ `--space`) by a factor `--font-factor`. For instance, `--xl` corresponds to `--space * --font-factor^2` – i.e. `4rem` by default.

> `       --space`: `1rem`  
> `--space-factor`: `2.0`  

Font sizing in flecss behaves analogous to the above described spacing. Heading sizes thus scale increasingly from `h5` on.

> `  --font-size`: `16px` (≡ `1rem`)  
> `--font-factor`: `1.5`  

#### Example

``` html
<div class="p p--large">
  <h2>Event</h2>
</div>
```

## Build Interface

Integrated via NPM, flecss comes with a mature build interface.

> ℹ️ The flecss build interface bases on the [sass](https://github.com/sass/dart-sass) transpiler and [clean-css](https://github.com/clean-css/clean-css) optimiser.

> ℹ️ Working with flecss on the SCSS layer enables custom overrides of the global flecss variables (e.g. `--space`).

### CLI

``` cli
npx flecss <path:source> <path:target> [--<flag:key|-<flag:shorthand>]*
```

| Flag | Description |
| :- | :- |
| `--standalone` `-S` | Build without including flecss. | 
| `--watch` `-W` | Watch file changes for incremental builds. | 

### API

``` ts
interface IBuildOptions {
  isDevelopment?: boolean;
  isStandalone?: boolean;
}
```

``` ts
function buildCSS(sourcePath: string, targetPath: string, options?: IBuildOptions & {
  modTimeTolerance?: number;
}): Promise<{
  executionTimeMs: number;
  sourcePath: string;
  targetPath: string;
  targetSizeByte: number;
}>
```

``` ts
function transpile(sourcePath: string, targetPath: string, options?: IBuildOptions): {
  css: string;
  loadedUrls: string[];
}
```

#### Example

``` js
const flecss = require("flecss");

flecss.buildCSS("./app.scss");
```

## Mixins

The flecss build interface predefines a set of helpful utility mixins that can be used throughout custom SCSS code.

### Breakpoint

Apply styles below a certain breakpoint (revisit [breakpoints](#breakpoints)).

``` scss
@include flecss_breakpoint--s
@include flecss_breakpoint--m
@include flecss_breakpoint--l
```

### Colour

Define a color through a global CSS variable (property) including shades.

``` scss
@include flecss_color($name, $color)
```

``` scss
--color-#{$name}: $color
--color-#{$name}--light: lighten($color, 10%)
--color-#{$name}--dark: darken($color, 10%)
```

### Theme

Apply styles for a certain color scheme (system).

``` scss
@include flecss_theme--light
@include flecss_theme--dark
```

---

<sub><sup>1</sup> As of 100+ analyzed web application designs.</sub>  
<sub><sup>2</sup> As of distribution `bootstrap.css` available June, 2024.</sub>  

##

<sub>&copy; Thassilo Martin Schiepanski</sub>