# flecss

**flecss** (pronounced _flex_): Modern and simple CSS framework utilising the power of flexbox.

<img src="./figures/flecss-logo.svg" width="225">

Unlike Bootstrap or Tailwind, flecss follows a CSS-first approach. It does not provide classes as granular as atomic CSS properties. Instead, it merely provides fundamental classes in favour of any layout <sup>1</sup>, but leaves the rest to individual stylesheets.

> 📦 flecss ships with a total of `8kB`, compared to Bootstrap with `248kB` <sup>2</sup>.

[1. Integration](#integration)  
[2. Classes](#classes)  
&emsp; [2.1 `.c` Condition](#%EF%B8%8F⃣-c-condition)  
&emsp; [2.2 `.f` Flex](#%EF%B8%8F⃣-f-flex)  
&emsp; [2.3 `.m` Margin](#%EF%B8%8F⃣-m-margin)  
&emsp; [2.4 `.p` Padding](#%EF%B8%8F⃣-p-padding)  
&emsp; [2.5 `.s` Section + `.w` Wrapper](#%EF%B8%8F⃣-s-section--%EF%B8%8F⃣-w-wrapper)  
&emsp; [2.6 `.t` Text](#%EF%B8%8F⃣-t-text)  
&emsp; [2.7 `.v` Viewport](#%EF%B8%8F⃣-v-viewport)  
[3. Modifiers](#modifiers)  
&emsp; [3.1 Space](#space)  
[4. Examples](#examples)  
[5. Build Interface](#build-interface)  
&emsp; [5.1 Breakpoints](#breakpoints)  
&emsp; [5.2 Colors](#colors)  
&emsp; [5.3 Themes](#themes)  

## Integration

#### From CDN

``` html
<link rel="stylesheet" href="https://raw.githubusercontent.com/t-ski/flecss/main/dist/flecss.css">
```

#### From NPM

``` cli
npm install -D flecss
```

#### Get Started

A flecss class name consists of a classifier `A`, as well as specifier suffix `B`: `.A_B`. Classes may also exist with default or unspecific properties (i.e. without a specifier). Each class comes with a handy shorthand classifier.

> ℹ️ Unlike for BEM, specific classes are standlone, i.e. inherit all shared style foundations. It is thus not required to assign the joint default and specific class name <sub>`❌ .padding .padding_l` `✅ .padding_l`</sub>.

## Classes

### *️⃣ `.c` `.condition`

The **condition** class represents toggleable layout conditions. At that, the explicit class describes the less common condition, whereas absence implies the complementary (common) condition.

#### Specifiers

` _disable` &emsp; **Greyout and disable for interaction.**  
`    _hide` &emsp; **Hide, but keep layout.**  
`_collapse` &emsp; **Hide, including layout (bounding box).**  

| <sup>&emsp;</sup> | <sup>`_disable`</sup> | <sup>`_hide`</sup> | <sup>`_collapse`</sup> |
| :- | :- | :- | :- |
| <img src="./figures/c-condition-none.svg" width="145"> | <img src="./figures/c-condition_disable.svg" width="145"> | <img src="./figures/c-condition_hide.svg" width="145"> | <img src="./figures/c-condition_collapse.svg" width="145"> |

#### Example

``` html
<button class="c--disable">Submit</button>
```

### *️⃣ `.f` `.flex`

The **flex** class is the vibrant layouting class in flecss. It allows for a number of flexbox-based content arrangements.

#### Specifiers

` _1` - `_9` &emsp; **`n` equal-sized content tiles per row with a homogeneous margin in between.**  

| <sup>`_1`</sup> | <sup>`_2`</sup> | <sup>`_3`</sup> |
| :- | :- | :- |
| <img src="./figures/f-flex_1.svg" width="145"> | <img src="./figures/f-flex_2.svg" width="145"> | <img src="./figures/f-flex_3.svg" width="145"> |

#### Example

``` html
<div class="f_2">
    <img src="/assets/event.png">
    <p>Panel on web technologies.</p>
</div>
```

### *️⃣ `.m` `.margin`

The **margin** class simply induces a margin to the respective element.

#### Specifiers

<sup>`   `</sup> <sup>`    default`</sup> &emsp; **Margin to all sides.**  
`_t` `    _top` &emsp; **Margin to the top only.**  
`_b` ` _bottom` &emsp; **Margin to the bottom only.**  
`_l` `   _left` &emsp; **Margin to the left only.**  
`_r` `  _right` &emsp; **Margin to the right only.**  

| | | | | |
| :- | :- | :- | :- | :- |
| <sup>`default`</sup><br><img src="./figures/m-margin.svg" width="145"> | <sup>`_top`</sup><br><img src="./figures/m-margin_top.svg" width="145"> | <sup>`_bottom`</sup><br><img src="./figures/m-margin_bottom.svg" width="145"> | <sup>`_left`</sup><br><img src="./figures/m-margin_left.svg" width="145"> | <sup>`_right`</sup><br><img src="./figures/m-margin_right.svg" width="145"> |

#### Example

``` html
<h2 class="p_b">Event</h2>
<p>Panel on web technologies.</p>
```

### *️⃣ `.p` `.padding`

The **padding** class simply induces a padding to the respective element.

#### Specifiers

<sup>`   `</sup> <sup>`    default`</sup> &emsp; **Padding to all sides.**  
`_t` `    _top` &emsp; **Padding to the top only.**  
`_b` ` _bottom` &emsp; **Padding to the bottom only.**  
`_l` `   _left` &emsp; **Padding to the left only.**  
`_r` `  _right` &emsp; **Padding to the right only.**  
 
| <sup>`default`</sup> | <sup>`_top`</sup> | <sup>`_bottom`</sup> | <sup>`_left`</sup> | <sup>`_right`</sup> |
| :- | :- | :- | :- | :- |
| <img src="./figures/p-padding.svg" width="145"> | <img src="./figures/p-padding_top.svg" width="145"> | <img src="./figures/p-padding_bottom.svg" width="145"> | <img src="./figures/p-padding_left.svg" width="145"> | <img src="./figures/p-padding_right.svg" width="145"> |

#### Example

``` html
<div class="p">
    <h2>Event</h2>
</div>
```

### *️⃣ `.s` `.section` + *️⃣ `.w` `.wrapper`

The **section** and **wrapper** class describe common vertical layouting containers. A section stretches across the full width, with a small affixed content padding at both vertical sides. The wrapper has a limited width and is centered within a section, with a large affixed content padding at both horizontal sides. Used in combination, the section-wrapper layouting classes provide a simple yet powerful tool.

| <sup>`.s`</sup> | <sup>`.w`</sup> | <sup>`.s` `>` `.w`</sup> |
| :- | :- | :- |
| <img src="./figures/s-section.svg" width="145"> | <img src="./figures/w-wrapper.svg" width="145"> | <img src="./figures/s-section--w-wrapper.svg" width="145"> |

> `$wrapper-width`: `1360px`

#### Example

``` html
<section class="section">
    <div class="wrapper">
        <h2>Event</h2>
    </div>
</div>
```

### *️⃣ `.t` `.text`

The **text** class helps with applying deviant text formatting.

#### Specifiers

`_l` `   _left` &emsp; **Align text to the left.**  
`_r` `  _right` &emsp; **Align text to the right.**  
`_c` ` _center` &emsp; **Align text to the center.**  
`_j` `_justify` &emsp; **Align text equally wide.**  

| <sup>`_left`</sup> | <sup>`_right`</sup> | <sup>`_center`</sup> | <sup>`_justify`</sup> |
| :- | :- | :- | :- |
| <img src="./figures/t-text_left.svg" width="145"> | <img src="./figures/t-text_right.svg" width="145"> | <img src="./figures/t-text_center.svg" width="145"> | <img src="./figures/t-text_justify.svg" width="145"> |

#### Example

``` html
<p class="t_center">
    Panel on web technologies.
</p>
```

### *️⃣ `.v` `.viewport`

The **viewport** class enables .

#### Specifiers

`    _s` `     _small` &emsp; **Show on small viewport only.**  
`    _m` `    _medium` &emsp; **Show on medium viewport only.**  
`    _l` `     _large` &emsp; **Show on large viewport only.**  
`_not-s` ` _not-small` &emsp; **Do not show on small viewport.**  
`_not-m` `_not-medium` &emsp; **Show on medium viewport only.**  
`_not-l` ` _not-large` &emsp; **Show on large viewport only.**  

| <sup>`_large`</sup> | <sup>`_not-large`</sup> |
| :- | :- |
| <img src="./figures/v-viewport_large.svg" width="145"> | <img src="./figures/v-viewport_not-large.svg" width="145"> |

> `$breakpoint-s`: `520px`  
> `$breakpoint-m`: `940px`  
> `$breakpoint-l`: `$wrapper-width`  

#### Example

``` html
<div class="p p--large">
    <h2>Event</h2>
</div>
```

## Modifiers

Instead of a specifier, a double dash indicated modifier `C` can be used to override a variable style property: `.A_C`. Each modifier is therefore linked with global SCSS variable.

> ℹ️ Integrating flecss as an SCSS build dependency allows to customise globally effective variables.

### Space

The space modifier describes spacing to apply with space-related classes. For instance, `.margin--large` (or `.m--large`, `.m--l`) would apply a large margin, instead of the default medium margin. However, using a modified class – e.g. `.padding--l` subsequently modifies the space to `2rem` (`$space-l`).

`--xs` `--extra-small` &emsp; **Extra small spacing corresponding to `$space-xs`.**  
` --s` `      --small` &emsp; **Small spacing corresponding to `$space-s`.**  
` --m` `     --medium` &emsp; **Medium spacing corresponding to `$space-m` <sup>`default`</sup>.**  
` --l` `      --large` &emsp; **Large spacing corresponding to `$space-l`.**  
`--xl` `--extra-large` &emsp; **Extra large spacing corresponding to `$space-xl`.**  

> `$space-xs`: `0.25rem`  
> ` $space-s`: `0.5rem`  
> ` $space-m`: `1rem`  
> ` $space-l`: `2rem`  
> `$space-xl`: `4rem`  

> ℹ️ flecss default font size – corresponding to `1rem` – is `16px`.

> $font-size: 16px;
> $font-scale-factor: 1.125;

#### Example

``` html
<div class="p p--large">
    <h2>Event</h2>
</div>
```

## Example

``` html
<style>
  .section {
    background-color: cornsilk;
  }
</style>
<main>
  <section class="section">
    <div class="wrapper">
      <h2>About</h2>
      <p class="margin--l m_t tect_c">
        flecss is a modern and simple CSS framework.
      </p>
      <a class="viewport_not-s" href="/sandbox">Try yourself</a>
    </div>
  </section>
</main>
```

## Build Interface

Installed with NPM, flecss comes with an integrated SCSS build interface. The build interface provides a supplementary set of helpful SCSS utility mixins.

> ℹ️ The flecss build interface bases on [SASS](https://github.com/sass/dart-sass) transpilation and [clean-css](https://github.com/clean-css/clean-css) optimisation.

#### Via CLI

``` cli
npx flecss <path:source> <path:target> [--<flag:key|-<flag:shorthand>]*
```

| Flag | Description |
| :- | :- |
| `--standalone` `-S` | Build without including flecss. | 
| `--watch` `-W` | Watch file changes for incremental builds. | 

#### Via API

``` js
const flecss = require("flecss");
```

``` ts
flecss.buildCSS(sourcePath: string, targetPath: string, options?: {
    isDevelopment?: boolean;
    isStandalone?: boolean;
    modTimeTolerance?: number;
}): Promise<{
  executionTimeMs: number;
  sourcePath: string;
  targetPath: string;
  targetSizeByte: number;
}>;
```

### Breakpoints

Apply styles below a certain breakpoint ([see variables](#%EF%B8%8F⃣-v-viewport)).

``` scss
@include flecss_breakpoint--s
@include flecss_breakpoint--m
@include flecss_breakpoint--l
```

### Colors

Define a color through a global CSS variable (property) including biaxial shading.

``` scss
@include flecss_color($name, $color)
```

``` scss
--color-#{$name}: $color
--color-#{$name}--light: lighten($color, 10%)
--color-#{$name}--dark: darken($color, 10%)
```

### Themes

Apply styles for a certain color scheme (system).

``` scss
@include flecss_theme--light
@include flecss_theme--dark
```

---

<sub><sup>1</sup> As of 100+ analyzed layouts.</sub>  
<sub><sup>2</sup> As of respective distributables available on June, 2024.</sub>  

##

<sub>&copy; Thassilo Martin Schiepanski</sub>