import{c as e,n as t,r as n,s as r}from"./index-UE9EZ_sX.js";import{t as i}from"./useViewport-BoYhjxSu.js";var a=e(),o=r(),s=[`bursts`,`stars`,`shards`,`cosmos`,`rainbow`,`swirl`,`glitter`,`gold`],c=1100,l=63/88,u=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,d=`#version 300 es
precision highp float;

uniform sampler2D uArt;
uniform vec2 uSize;
uniform float uAspect;
uniform vec2 uTilt;
uniform vec2 uLight;
uniform float uDistance;
uniform int uPreset;
uniform float uIntensity;
uniform float uScale;
uniform float uEdge;
uniform float uFrame;
uniform float uRadius;
uniform float uGlare;
uniform vec3 uFoil;
uniform float uReady;

out vec4 outColor;

const float TAU = 6.28318530718;

struct Foil {
  float mask;
  float angle;
  float jitter;
  vec2 facet;
};

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

vec2 hash2(vec2 p) {
  return vec2(hash(p), hash(p + 17.31));
}

vec3 hue(float t) {
  t = abs(fract(t * 0.5) * 2.0 - 1.0);
  vec3 c = mix(vec3(0.1, 0.25, 1.0), vec3(0.0, 0.85, 1.0), smoothstep(0.0, 0.25, t));
  c = mix(c, vec3(0.25, 1.0, 0.2), smoothstep(0.25, 0.45, t));
  c = mix(c, vec3(1.0, 0.92, 0.05), smoothstep(0.45, 0.65, t));
  c = mix(c, vec3(1.0, 0.45, 0.05), smoothstep(0.65, 0.85, t));
  return mix(c, vec3(0.95, 0.12, 0.3), smoothstep(0.85, 1.0, t));
}

Foil bursts(vec2 p) {
  vec2 q = mat2(0.7071068, 0.7071068, -0.7071068, 0.7071068) * (p - vec2(0.5, 0.5 * uAspect)) / (0.283 / uScale);
  vec2 d = fract(q) - 0.5;
  float u = length(d) / 0.49;
  float angle = atan(d.y, d.x);
  if (u < 0.12) {
    float ring = min(floor(u / 0.045 + 0.5), 2.0);
    float count = max(1.0, ring * 6.0);
    float spot = (floor(angle / TAU * count) + 0.5) / count * TAU;
    vec2 dot = vec2(cos(spot), sin(spot)) * ring * 0.045;
    float m = smoothstep(0.024, 0.012, length(d / 0.49 - dot));
    return Foil(m, angle, 0.5, vec2(0.0));
  }
  bool inner = u < 0.66;
  float slot = angle / TAU * (inner ? 56.0 : 72.0);
  bool shifted = mod(floor(slot), 2.0) > 0.5;
  vec2 band = inner ? (shifted ? vec2(0.45, 0.61) : vec2(0.33, 0.49)) : (shifted ? vec2(0.84, 0.99) : vec2(0.7, 0.85));
  float across = abs(u - (band.x + band.y) * 0.5) / ((band.y - band.x) * 0.5);
  float along = abs(fract(slot) - 0.5) * 2.0;
  float width = inner ? 0.72 : 0.6;
  float m = smoothstep(1.0, 0.78, across) * smoothstep(width, width - 0.2, along);
  return Foil(m, angle, 0.5, vec2(0.0));
}

Foil stars(vec2 p) {
  Foil best = Foil(0.0, 0.0, 0.0, vec2(0.0));
  vec2 g = p / (0.08 / uScale);
  vec2 base = floor(g);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 id = base + vec2(float(i), float(j));
      float pick = hash(id + 1.3);
      vec2 d = g - (id + 0.5 + (hash2(id) - 0.5) * 0.55);
      float m = smoothstep(0.07, 0.035, length(d));
      if (pick < 0.62) {
        float size = mix(0.16, 0.5, pow(hash(id + 9.0), 1.8));
        float sector = TAU / (pick < 0.3 ? 4.0 : 5.0);
        float k = abs(fract((atan(d.y, d.x) + hash(id + 4.0) * TAU) / sector) - 0.5) * 2.0;
        float edge = size * mix(1.0, 0.36, pow(k, 0.6));
        m = smoothstep(edge, edge * 0.8, length(d));
      }
      if (m > best.mask) best = Foil(m, hash(id + 6.0) * TAU, hash(id + 8.0), (hash2(id + 2.0) - 0.5) * 0.6);
    }
  }
  return best;
}

Foil shards(vec2 p) {
  vec2 g = p * 19.0 * uScale;
  vec2 base = floor(g);
  float best = 9.0;
  float second = 9.0;
  vec2 id = base;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 cell = base + vec2(float(i), float(j));
      float d = length(cell + 0.08 + hash2(cell) * 0.84 - g);
      if (d < best) {
        second = best;
        best = d;
        id = cell;
      } else if (d < second) {
        second = d;
      }
    }
  }
  float crack = smoothstep(0.015, 0.07, second - best);
  float shine = 0.25 + 0.75 * pow(hash(id + 7.7), 2.0);
  return Foil((0.2 + 0.8 * crack) * shine, hash(id + 3.17) * TAU, hash(id + 11.73), (hash2(id + 5.0) - 0.5) * 0.5);
}

Foil cosmos(vec2 p) {
  Foil best = Foil(0.0, 0.0, 0.0, vec2(0.0));
  vec2 g = p / (0.16 / uScale);
  vec2 base = floor(g);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 id = base + vec2(float(i), float(j));
      vec2 d = g - (id + 0.5 + (hash2(id) - 0.5) * 0.7);
      float size = mix(0.16, 0.52, hash(id + 2.0));
      float r = length(d);
      float m = max(smoothstep(0.05, 0.0, abs(r - size)), smoothstep(size, size - 0.04, r) * 0.22);
      if (m > best.mask) best = Foil(m, hash(id + 6.0) * TAU + atan(d.y, d.x) * 0.5, hash(id + 1.0), (hash2(id + 4.0) - 0.5) * 0.5);
    }
  }
  vec2 fine = p / (0.035 / uScale);
  vec2 cell = floor(fine);
  float dots = smoothstep(0.2, 0.1, length(fine - cell - 0.5 - (hash2(cell + 9.0) - 0.5) * 0.6)) * step(0.55, hash(cell + 2.0));
  if (dots > best.mask) best = Foil(dots, hash(cell) * TAU, hash(cell + 3.0), (hash2(cell + 7.0) - 0.5) * 0.6);
  return best;
}

Foil rainbow(vec2 p) {
  return Foil(0.86 + 0.14 * hash(floor(p * 700.0 * uScale)), 0.2, 0.5, vec2(0.0));
}

Foil swirl(vec2 p) {
  vec2 d = p - vec2(0.5, 0.42 * uAspect);
  float angle = atan(d.y, d.x);
  float rays = 0.55 + 0.45 * smoothstep(0.3, 0.7, abs(fract(angle / TAU * 60.0 * uScale) - 0.5) * 2.0);
  return Foil(rays, angle, length(d), vec2(0.0));
}

Foil glitter(vec2 p) {
  vec2 g = p * 72.0 * uScale;
  vec2 cell = floor(g);
  float size = mix(0.18, 0.4, hash(cell + 3.0));
  float m = smoothstep(size, size * 0.55, length(fract(g) - 0.5 - (hash2(cell) - 0.5) * 0.5)) * step(0.25, hash(cell + 5.0));
  return Foil(m, hash(cell + 7.0) * TAU, hash(cell + 9.0), (hash2(cell + 11.0) - 0.5) * 0.9);
}

Foil gold(vec2 p) {
  Foil flake = glitter(p * 0.8);
  if (flake.mask > 0.5) return flake;
  float etch = 0.55 + 0.45 * smoothstep(0.2, 0.8, abs(fract((p.x * 0.6 + p.y) * 140.0 * uScale) - 0.5) * 2.0);
  return Foil(etch, 0.9, 0.4, vec2(0.0));
}

vec3 sparkles(vec2 p, vec3 halfway, vec2 sweep, float awake) {
  vec2 g = p * 62.0;
  vec2 cell = floor(g);
  vec2 d = fract(g) - 0.5 - (hash2(cell) - 0.5) * 0.36;
  float spin = hash(cell + 3.0) * TAU;
  d = mat2(cos(spin), -sin(spin), sin(spin), cos(spin)) * d;
  vec2 a = abs(d);
  float hexagon = max(a.x * 0.866 + a.y * 0.5, a.y);
  float size = mix(0.22, 0.38, hash(cell + 2.0));
  float piece = smoothstep(size, size - 0.07, hexagon) * step(0.42, hash(cell + 4.0));
  vec3 facet = normalize(vec3((hash2(cell + 6.0) - 0.5) * 0.9, 1.0));
  float flash = pow(max(dot(facet, halfway), 0.0), 6.0);
  vec3 tint = hue(dot(sweep, vec2(cos(spin), sin(spin))) * 1.2 + dot(sweep, vec2(0.8, 0.6)) * 0.8 + hash(cell + 8.0) * 0.5);
  vec3 color = piece * tint * (0.3 + 1.6 * flash) * awake;
  vec2 fine = p * 210.0;
  vec2 speckCell = floor(fine);
  float speck = smoothstep(0.24, 0.0, length(fract(fine) - 0.5 - (hash2(speckCell) - 0.5) * 0.5)) * step(0.72, hash(speckCell + 1.0));
  float speckFlash = pow(max(dot(normalize(vec3((hash2(speckCell + 2.0) - 0.5) * 0.9, 1.0)), halfway), 0.0), 10.0);
  return color + vec3(1.2) * speck * speckFlash * (1.0 - piece);
}

void main() {
  vec2 uv = vec2(gl_FragCoord.x / uSize.x, 1.0 - gl_FragCoord.y / uSize.y);
  vec2 p = vec2(uv.x, uv.y * uAspect);
  vec2 center = vec2(0.5, 0.5 * uAspect);
  vec2 q = abs(p - center) - center + uRadius;
  float outside = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float pixel = 1.0 / uSize.x;
  float alpha = clamp(0.5 - outside / pixel, 0.0, 1.0);
  vec4 sampled = texture(uArt, uv);
  if (uReady > 0.5) alpha *= sampled.a;
  if (alpha <= 0.0) {
    outColor = vec4(0.0);
    return;
  }
  vec3 art = uReady > 0.5 ? pow(sampled.rgb, vec3(2.2)) : vec3(0.12);

  mat3 rx = mat3(1.0, 0.0, 0.0, 0.0, cos(uTilt.x), sin(uTilt.x), 0.0, -sin(uTilt.x), cos(uTilt.x));
  mat3 ry = mat3(cos(uTilt.y), 0.0, -sin(uTilt.y), 0.0, 1.0, 0.0, sin(uTilt.y), 0.0, cos(uTilt.y));
  mat3 turn = rx * ry;
  vec3 world = turn * vec3(p - center, 0.0);
  vec3 view = normalize(transpose(turn) * (vec3(0.0, 0.0, uDistance) - world));
  vec3 lamp = vec3((uLight - 0.5) * vec2(1.1, 1.1 * uAspect), 0.9);
  vec3 light = normalize(transpose(turn) * (lamp - world));
  vec3 halfway = normalize(light + view);
  vec2 sweep = light.xy + view.xy;
  float sheen = pow(max(halfway.z, 0.0), 10.0);
  float shine = pow(max(halfway.z, 0.0), 80.0);
  float frame = 1.0 - smoothstep(uFrame - pixel, uFrame + pixel, -outside);

  Foil f;
  if (uPreset == 0) f = bursts(p);
  else if (uPreset == 1) f = stars(p);
  else if (uPreset == 2) f = shards(p);
  else if (uPreset == 3) f = cosmos(p);
  else if (uPreset == 4) f = rainbow(p);
  else if (uPreset == 5) f = swirl(p);
  else if (uPreset == 6) f = glitter(p);
  else f = gold(p);

  vec3 metal = uPreset == 7 ? vec3(1.0, 0.74, 0.38) * dot(uFoil, vec3(0.3333)) * 1.15 : uFoil;
  vec4 look = uPreset == 0 ? vec4(0.25, 1.9, 0.12, 1.0)
    : uPreset == 1 ? vec4(0.6, 1.4, 0.3, 1.0)
    : uPreset == 2 ? vec4(0.9, 0.9, 0.6, 0.5)
    : uPreset == 3 ? vec4(0.7, 1.2, 0.35, 0.85)
    : uPreset == 4 ? vec4(0.0, 2.2, 0.0, 0.45)
    : uPreset == 5 ? vec4(1.6, 0.3, 0.0, 0.4)
    : uPreset == 6 ? vec4(0.9, 1.0, 0.6, 1.0)
    : vec4(0.3, 1.0, 0.2, 0.95);
  vec2 dir = vec2(cos(f.angle), sin(f.angle));
  float phase = dot(sweep, dir) * look.x + dot(sweep, vec2(0.8, 0.6)) * look.y + f.jitter * look.z;
  float spoke = 1.0;
  if (uPreset == 5) {
    float facing = dot(normalize(sweep + 0.0001), dir);
    phase = f.jitter * 2.4 + facing * 0.6 + length(sweep) * 0.8;
    spoke = 0.3 + 0.7 * smoothstep(0.25, 0.95, abs(facing));
  }
  vec3 tint = hue(phase);
  if (uPreset == 7) tint = mix(tint, metal, 0.65);
  float glint = pow(max(dot(normalize(vec3(f.facet, 1.0)), halfway), 0.0), 24.0) * step(0.001, length(f.facet));
  bool layered = uPreset == 2 || uPreset == 4 || uPreset == 5 || uPreset == 7;
  vec3 foil = (layered ? tint : mix(tint, vec3(1.0), 0.12)) * (1.15 + 0.3 * sheen) + metal * glint * 1.2;
  float tilted = smoothstep(0.02, 0.21, length(sin(uTilt)));
  float awake = mix(0.2, 1.0, tilted);
  float strength = uIntensity * f.mask * (1.0 - frame) * awake;
  float band = uPreset == 5 ? spoke : layered ? 0.25 + 0.75 * smoothstep(0.3, 0.95, 0.5 + 0.5 * cos(phase * TAU * 0.5 + 1.3)) : 1.0;
  vec3 color = layered
    ? 1.0 - (1.0 - art) * (1.0 - clamp(foil * look.w * band * strength, 0.0, 1.0))
    : mix(art, foil, clamp(strength * look.w, 0.0, 1.0));
  color += sparkles(p, halfway, sweep, mix(0.55, 1.0, tilted)) * uEdge * frame;
  color += uFoil * sheen * 0.12 * frame;
  color += vec3(sheen * 0.07 + shine * 0.3) * uGlare;
  color = pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.2));
  outColor = vec4(color * alpha, alpha);
}
`,f=(e,t,n)=>Math.min(n,Math.max(t,e)),p=e=>{let t=[.78,.8,.84];if(typeof document>`u`)return t;let n=document.createElement(`canvas`).getContext(`2d`);if(!n)return t;n.fillStyle=`#000000`,n.fillStyle=e;let r=n.fillStyle;return!r.startsWith(`#`)||r.length!==7?t:[1,3,5].map(e=>(parseInt(r.slice(e,e+2),16)/255)**2.2)},m=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null};function h({image:e,backImage:t,alt:n=``,preset:r=`bursts`,intensity:i=.85,scale:h=1,edgeSparkle:g=.8,frame:_=4,glare:v=.5,foilColor:y=`#e2e6ec`,width:b=320,radius:x=14,tiltMax:S=14,hoverScale:C=1.04,idle:w=!0,shadow:T=!0,className:E=``,style:D}){let O=(0,a.useRef)(null),k=(0,a.useRef)(null),A=(0,a.useRef)(null),j=(0,a.useRef)(null),M=(0,a.useRef)(null),N=(0,a.useRef)({x:.5,y:.5,inside:!1}),P=(0,a.useRef)(null),F=(0,a.useRef)(null),I=(0,a.useRef)(!1),[L,R]=(0,a.useState)(l),[z,B]=(0,a.useState)(!1),[V,H]=(0,a.useState)(!1),[U,W]=(0,a.useState)(!1),G=!!t;M.current={preset:Math.max(0,s.indexOf(r)),intensity:f(i,0,1),scale:f(h,.25,4),edgeSparkle:f(g,0,1),frame:f(_,0,20)/100,glare:f(v,0,1),foil:p(y),radius:Math.max(0,x),tiltMax:f(S,0,45),hoverScale:f(C,.8,1.3),idle:w},I.current=G&&V,(0,a.useEffect)(()=>{P.current?.()}),(0,a.useEffect)(()=>{F.current?.(e)},[e]),(0,a.useEffect)(()=>{let t=O.current,n=k.current,r=j.current;if(!t||!n||!r)return;let i=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,a=r.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1}),o=null,s=null,l=null,f={},p=!1;if(a){let e=m(a,a.VERTEX_SHADER,u),t=m(a,a.FRAGMENT_SHADER,d);if(e&&t&&(o=a.createProgram(),a.attachShader(o,e),a.attachShader(o,t),a.bindAttribLocation(o,0,`position`),a.linkProgram(o),a.deleteShader(e),a.deleteShader(t),a.getProgramParameter(o,a.LINK_STATUS)||(a.deleteProgram(o),o=null)),o){l=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,l),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),a.STATIC_DRAW),a.enableVertexAttribArray(0),a.vertexAttribPointer(0,2,a.FLOAT,!1,0,0),s=a.createTexture(),a.bindTexture(a.TEXTURE_2D,s),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));for(let e of[`uArt`,`uSize`,`uAspect`,`uTilt`,`uLight`,`uDistance`,`uPreset`,`uIntensity`,`uScale`,`uEdge`,`uFrame`,`uRadius`,`uGlare`,`uFoil`,`uReady`])f[e]=a.getUniformLocation(o,e)}}(!a||!o)&&W(!0);let h={tiltX:0,tiltY:0,tiltVX:0,tiltVY:0,lightX:.36,lightY:.26,lightVX:0,lightVY:0,lift:1,liftV:0,turn:0,turnV:0,clock:Math.random()*40},g=0,_=0,v=!0,y=!0,b=0,x=()=>{if(!a||!o)return;let e=M.current,t=r.width,n=r.height;t&&n&&(a.viewport(0,0,t,n),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT),a.useProgram(o),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,s),a.uniform1i(f.uArt,0),a.uniform2f(f.uSize,t,n),a.uniform1f(f.uAspect,n/t),a.uniform2f(f.uTilt,h.tiltX*Math.PI/180,(h.tiltY+h.turn)*Math.PI/180),a.uniform2f(f.uLight,h.lightX,h.lightY),a.uniform1f(f.uDistance,c/Math.max(1,r.clientWidth)),a.uniform1i(f.uPreset,e.preset),a.uniform1f(f.uIntensity,e.intensity),a.uniform1f(f.uScale,e.scale),a.uniform1f(f.uEdge,e.edgeSparkle),a.uniform1f(f.uFrame,e.frame),a.uniform1f(f.uRadius,e.radius/Math.max(1,r.clientWidth)),a.uniform1f(f.uGlare,e.glare),a.uniform3f(f.uFoil,e.foil[0],e.foil[1],e.foil[2]),a.uniform1f(f.uReady,+!!p),a.drawArrays(a.TRIANGLES,0,3))},S=(e,t,n,r,i,a)=>{let o=t+((n-e)*r-t*i)*a;return[e+o*a,o]},C=e=>{if(g=0,!y)return;let t=Math.min(1/30,Math.max(1/240,(e-_)/1e3));_=e;let r=M.current,a=N.current,o=0,s=0,l=.36,u=.26,d=1,f=r.idle&&!i&&!a.inside;if(a.inside&&!i)o=(.5-a.y)*2*r.tiltMax,s=(a.x-.5)*2*r.tiltMax,l=a.x,u=a.y,d=r.hoverScale;else if(f){h.clock+=t;let e=h.clock;o=Math.sin(e*.7)*r.tiltMax*.28,s=Math.sin(e*.53+1.2)*r.tiltMax*.4,l=.5+Math.sin(e*.41)*.42,u=.38+Math.sin(e*.33+.6)*.3}let p=Math.ceil(t/(1/240)),m=t/p;for(let e=0;e<p;e++)[h.tiltX,h.tiltVX]=S(h.tiltX,h.tiltVX,o,150,16,m),[h.tiltY,h.tiltVY]=S(h.tiltY,h.tiltVY,s,150,16,m),[h.lightX,h.lightVX]=S(h.lightX,h.lightVX,l,220,30,m),[h.lightY,h.lightVY]=S(h.lightY,h.lightVY,u,220,30,m),[h.lift,h.liftV]=S(h.lift,h.liftV,d,320,30,m),[h.turn,h.turnV]=i?[I.current?180:0,0]:S(h.turn,h.turnV,I.current?180:0,170,20,m);n.style.transform=`perspective(${c}px) scale(${h.lift}) rotateX(${h.tiltX}deg) rotateY(${h.tiltY+h.turn}deg)`,A.current&&(A.current.style.transform=`translate(${-h.tiltY*.7}px, ${h.tiltX*.7}px) scale(${.9+(h.lift-1)*1.5})`),Math.cos((h.tiltY+h.turn)*Math.PI/180)>-.05&&x(),b=Math.abs(h.tiltVX)+Math.abs(h.tiltVY)+Math.abs(h.liftV)*40+Math.abs(h.turnV)+(Math.abs(h.lightVX)+Math.abs(h.lightVY))*60+Math.abs(h.tiltX-o)+Math.abs(h.tiltY-s)>.02?0:b+t,!(!v||!f&&!a.inside&&b>.3)&&(g=requestAnimationFrame(C))},w=()=>{!g&&y&&(b=0,_=performance.now(),g=requestAnimationFrame(C))};P.current=w;let T=()=>{let e=Math.min(window.devicePixelRatio||1,2),t=Math.max(1,Math.round(r.clientWidth*e)),n=Math.max(1,Math.round(r.clientHeight*e));(r.width!==t||r.height!==n)&&(r.width=t,r.height=n),x(),w()};F.current=e=>{if(p=!1,B(!1),!e)return;let t=new Image;t.crossOrigin=`anonymous`,t.decoding=`async`,t.onload=()=>{if(y&&(t.naturalWidth&&t.naturalHeight&&R(t.naturalWidth/t.naturalHeight),a&&o))try{a.bindTexture(a.TEXTURE_2D,s),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,t),a.generateMipmap(a.TEXTURE_2D),p=!0,B(!0),x(),w()}catch{p=!1}},t.src=e},F.current(e);let E=new ResizeObserver(T);E.observe(r);let D=new IntersectionObserver(e=>{v=e.some(e=>e.isIntersecting),v&&w()});return D.observe(t),T(),()=>{y=!1,cancelAnimationFrame(g),P.current=null,F.current=null,E.disconnect(),D.disconnect(),a&&(a.deleteTexture(s),a.deleteBuffer(l),a.deleteProgram(o))}},[]);let K=e=>{if(e.pointerType===`touch`&&e.type===`pointermove`&&!e.buttons)return;let t=e.currentTarget.getBoundingClientRect();N.current={x:f((e.clientX-t.left)/t.width,0,1),y:f((e.clientY-t.top)/t.height,0,1),inside:!0},O.current?.style.setProperty(`--mx`,`${N.current.x*100}%`),O.current?.style.setProperty(`--my`,`${N.current.y*100}%`),P.current?.()},q=()=>{N.current={...N.current,inside:!1},P.current?.()},J=()=>{G&&H(e=>!e)};return(0,o.jsxs)(`div`,{ref:O,className:`holo-card${E?` ${E}`:``}`,role:G?`button`:`img`,tabIndex:G?0:void 0,"aria-label":n||void 0,"aria-pressed":G?V:void 0,"data-ready":z?``:void 0,"data-flippable":G?``:void 0,onPointerEnter:K,onPointerMove:K,onPointerDown:K,onPointerLeave:q,onPointerCancel:q,onClick:J,onKeyDown:e=>{!G||e.key!==`Enter`&&e.key!==` `||(e.preventDefault(),e.repeat||J())},style:{"--hc-w":`${b}px`,"--hc-ratio":L,"--hc-radius":`${x}px`,...D},children:[T?(0,o.jsx)(`span`,{ref:A,className:`holo-card__shadow`,"aria-hidden":`true`}):null,(0,o.jsxs)(`div`,{ref:k,className:`holo-card__rotor`,children:[(0,o.jsxs)(`div`,{className:`holo-card__face holo-card__face--front`,children:[e?(0,o.jsx)(`img`,{src:e,alt:``,draggable:!1}):null,(0,o.jsx)(`canvas`,{ref:j}),U?(0,o.jsx)(`span`,{className:`holo-card__sheen`,"data-preset":r,"aria-hidden":`true`}):null]}),G?(0,o.jsx)(`div`,{className:`holo-card__face holo-card__face--back`,children:(0,o.jsx)(`img`,{src:t,alt:``,draggable:!1})}):null]})]})}var g=630,_=880,v=(e,t,n)=>{let r=t.split(` `),i=[],a=``;for(let t of r){let r=a?`${a} ${t}`:t;e.measureText(r).width>n&&a?(i.push(a),a=t):a=r}return a&&i.push(a),i};async function y(){try{await document.fonts.load(`400 120px "Playfair Display"`),await document.fonts.load(`italic 400 40px "Playfair Display"`),await document.fonts.load(`300 24px "Inter"`),await document.fonts.load(`400 24px "JetBrains Mono"`)}catch{}}function b(e,t,n){e.fillStyle=`#08080a`,e.fillRect(0,0,g,_),e.strokeStyle=`rgba(244,242,239,.05)`,e.lineWidth=1;for(let t=0;t<=g;t+=30)e.beginPath(),e.moveTo(t,0),e.lineTo(t,_),e.stroke();for(let t=0;t<=_;t+=30)e.beginPath(),e.moveTo(0,t),e.lineTo(g,t),e.stroke();e.strokeStyle=`rgba(244,242,239,.38)`,e.lineWidth=1.5,e.strokeRect(30,30,570,820),e.strokeStyle=`rgba(244,242,239,.14)`,e.strokeRect(42,42,546,796),e.fillStyle=`#8c8783`,e.font=`400 20px "JetBrains Mono", monospace`,e.letterSpacing=`4px`,e.textAlign=`left`,e.fillText(t.toUpperCase(),66,92),e.textAlign=`right`,e.fillText(n,564,92),e.textAlign=`left`}function x(e){e.fillStyle=`rgba(244,242,239,.38)`,e.font=`400 16px "JetBrains Mono", monospace`,e.letterSpacing=`4px`,e.textAlign=`center`,e.fillText(`SEMILLERO · IA · 2026`,g/2,818)}function S(){let e=document.createElement(`canvas`);return e.width=g,e.height=_,[e,e.getContext(`2d`)]}async function C({glyph:e,label:t,title:n,bullets:r,index:i}){await y();let[a,o]=S();b(o,t,i),o.strokeStyle=`rgba(244,242,239,.1)`;for(let e=70;e<=250;e+=36)o.beginPath(),o.arc(g/2,370,e,0,Math.PI*2),o.stroke();o.fillStyle=`#f4f2ef`,o.font=`400 300px "Playfair Display", serif`,o.textAlign=`center`,o.letterSpacing=`0px`,o.fillText(e,g/2,440),o.font=`italic 400 54px "Playfair Display", serif`;let s=v(o,n,490);s.forEach((e,t)=>o.fillText(e,g/2,608+t*58)),o.textAlign=`left`,o.font=`400 21px "JetBrains Mono", monospace`,o.fillStyle=`#9dffb0`;let c=608+s.length*58+26;return r.forEach((e,t)=>{o.fillText(`› ${e}`,74,c+t*34)}),x(o),a.toDataURL(`image/png`)}function w(e,t,{glyph:n,title:r,skills:i,evidence:a,tools:o}){e.letterSpacing=`0px`,e.textAlign=`right`,e.fillStyle=`rgba(244,242,239,.12)`,e.font=`400 ${Math.round(210*t)}px "Playfair Display", serif`,e.fillText(n,568,290*t+20),e.textAlign=`left`,e.fillStyle=`#f4f2ef`,e.font=`italic 400 ${Math.round(46*t)}px "Playfair Display", serif`;let s=v(e,r,400);s.forEach((n,r)=>e.fillText(n,70,168+r*50*t));let c=168+(s.length-1)*50*t+78*t,l=n=>{e.font=`400 ${Math.round(15*t)}px "JetBrains Mono", monospace`,e.letterSpacing=`4px`,e.fillStyle=`#8c8783`,e.fillText(n.toUpperCase(),70,c),e.strokeStyle=`rgba(244,242,239,.16)`,e.lineWidth=1,e.beginPath(),e.moveTo(70,c+12),e.lineTo(560,c+12),e.stroke(),e.letterSpacing=`0px`,c+=44*t};l(`Habilidades`),e.font=`400 ${Math.round(24*t)}px "JetBrains Mono", monospace`,e.fillStyle=`#9dffb0`;for(let n of i){let r=v(e,n,460);r.forEach((n,r)=>e.fillText(r===0?`› ${n}`:`   ${n}`,74,c+r*31*t)),c+=r.length*31*t+10*t}c+=20*t,l(`Evidencia`),e.font=`300 ${Math.round(24*t)}px "Inter", sans-serif`,e.fillStyle=`rgba(244,242,239,.88)`;let u=v(e,a,490);u.forEach((n,r)=>e.fillText(n,72,c+r*34*t)),c+=u.length*34*t,c+=26*t,l(`Herramientas`),e.font=`400 ${Math.round(18*t)}px "JetBrains Mono", monospace`;let d=70;for(let n of o){let r=e.measureText(n).width+28*t;d+r>560&&(d=70,c+=46*t),e.strokeStyle=`rgba(244,242,239,.4)`,e.lineWidth=1.2,e.beginPath(),e.roundRect(d,c-23*t,r,34*t,17*t),e.stroke(),e.fillStyle=`#f4f2ef`,e.fillText(n,d+14*t,c),d+=r+12*t}return c+14*t}async function T({label:e,index:t,...n}){await y();let[r,i]=S();for(let r of[1,.94,.88,.82,.76,.7])if(b(i,`${e} · qué demostró`,t),w(i,r,n)<=758)break;return x(i),r.toDataURL(`image/png`)}var E={A:{front:{glyph:`A`,label:`Ruta A`,index:`01/02`,title:`Resolución operativa`,bullets:[`documentación → período de prueba`]},back:{glyph:`A`,label:`Ruta A`,index:`01/02`,title:`Resolución operativa`,skills:[`Investigar a fondo la documentación`,`Resolver bajo restricciones reales`,`Gestionar un período de prueba válido`],evidence:`Logró correr el sistema sin guías paso a paso ni instrucciones adicionales.`,tools:[`Claude Code`,`período de prueba`,`documentación`]},cap:`Candidato 1 · investiga y gestiona`,preset:`bursts`,timeline:[`Instrucción: instalar Claude Code`,`Barrera: herramienta de pago`,`Investiga la documentación`,`Gestiona un período de prueba válido`,`Corre el sistema`]},B:{front:{glyph:`B`,label:`Ruta B`,index:`02/02`,title:`Criterio ingenieril`,bullets:[`Ollama → modelo local`]},back:{glyph:`B`,label:`Ruta B`,index:`02/02`,title:`Criterio ingenieril`,skills:[`Pensamiento lateral`,`Descubrir alternativas abiertas`,`Vincular el entorno a un modelo local`],evidence:`Con un proveedor de modelos locales como Ollama ejecutó la herramienta de forma abierta y gratuita.`,tools:[`Ollama`,`modelo local`,`Claude Code`]},cap:`Candidato 2 · alternativa abierta`,preset:`gold`,timeline:[`Instrucción: instalar Claude Code`,`Barrera: herramienta de pago`,`Descubre Ollama (modelos locales)`,`Vincula el entorno de trabajo`,`La ejecuta: abierta y gratuita`]}};function D({step:e,active:r}){let[s,c]=(0,a.useState)(null),[l,u]=(0,a.useState)(null),{h:d}=i();(0,a.useEffect)(()=>{let e=!0;return Promise.all([C(E.A.front),T(E.A.back),C(E.B.front),T(E.B.back)]).then(t=>e&&c(t)),()=>{e=!1}},[]);let f=Math.round(Math.min(d*.56*(63/88),380)),p=l?`tl${l}`:e>=1?`quote`:`intro`,m=(e,t,n,i)=>(0,o.jsxs)(`div`,{className:`s08-card rv${l===e?` is-view`:``}`,style:{"--i":t},onPointerEnter:()=>u(e),onPointerLeave:()=>u(null),onFocus:()=>u(e),onBlur:()=>u(null),children:[s&&r&&(0,o.jsx)(h,{image:n,backImage:i,alt:`Insignia: ${E[e].front.label}, ${E[e].front.title.toLowerCase()}. Clic para ver qué demostró.`,preset:E[e].preset,foilColor:`#e2e6ec`,intensity:.7,edgeSparkle:.8,frame:4,glare:.5,tiltMax:14,hoverScale:1.04,radius:14,width:f,idle:!0,shadow:!0}),(0,o.jsx)(`span`,{className:`s08-cap`,children:E[e].cap}),(0,o.jsx)(`span`,{className:`s08-flip`,children:`clic para voltear`})]});return(0,o.jsxs)(`section`,{className:`slide s08`,children:[(0,o.jsx)(t,{className:`s08-bg`,src:n.routes,veil:.5}),m(`A`,1,s?.[0],s?.[1]),(0,o.jsxs)(`div`,{className:`s08-mid`,children:[(0,o.jsx)(`span`,{className:`eyebrow rv`,style:{"--i":0},children:`Acto III · lo que demostró cada candidato`}),(0,o.jsxs)(`h2`,{className:`display s08-h rv`,style:{"--i":2},children:[`Dos rutas.`,(0,o.jsx)(`br`,{}),(0,o.jsx)(`em`,{children:`Dos victorias.`})]}),(0,o.jsxs)(`div`,{className:`s08-stage rv`,style:{"--i":4},"aria-live":`polite`,children:[(0,o.jsx)(`div`,{className:`s08-sec s08-intro${p===`intro`?` on`:``}`,children:(0,o.jsx)(`p`,{children:`Eso no es memorizar un manual: es resolución ingenieril de problemas bajo restricciones reales.`})}),[`A`,`B`].map(e=>(0,o.jsxs)(`div`,{className:`s08-sec${p===`tl${e}`?` on`:``}`,children:[(0,o.jsx)(`span`,{className:`s08-tlhead`,children:E[e].front.label}),(0,o.jsx)(`ol`,{className:`s08-tl`,children:E[e].timeline.map((t,n)=>(0,o.jsx)(`li`,{style:{"--k":n},className:n===E[e].timeline.length-1?`is-last`:``,children:t},t))})]},e)),(0,o.jsxs)(`div`,{className:`s08-sec s08-quote${p===`quote`?` on`:``}`,children:[(0,o.jsx)(`span`,{children:`«Resolución ingenieril»`}),(0,o.jsx)(`small`,{children:`sin guías paso a paso ni instrucciones adicionales: dos candidatos alcanzaron el nivel esperado.`})]})]})]}),m(`B`,2,s?.[2],s?.[3])]})}export{D as default};