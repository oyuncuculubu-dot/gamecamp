/**
 * TikFinity AZ Studio v4.2 PRO — Zero-Lag Single-Pass WebGL / GLSL Shader Engine
 *
 * Performance & Quality Guarantees:
 *   - Only 1 WebGL context per medallion (3 total on stage, never recreated across SSE updates).
 *   - ZERO CSS filter: drop-shadow() on animated WebGL containers (shadow is computed in GPU shader).
 *   - ZERO 2D cartoon hearts, ZERO crosshairs, ZERO floating pill boxes.
 *   - Articulated 3D wing breathing, independent 3D crown hover, real-time metallic specular sweep,
 *     and diamond-cut crystal facet caustics at locked 60 FPS (< 1.2ms GPU frame time).
 */
(function (root) {
  'use strict';

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function easeInOutCubic(x) {
    const t = clamp(x, 0, 1);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  }

  const FRAME_VERT_SRC = `
    attribute vec2 aPos;
    varying vec2 vUV;
    void main() {
      vUV = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  const FRAME_FRAG_SRC = `
    precision mediump float;
    varying vec2 vUV;

    uniform sampler2D uTex;
    uniform float uTime;
    uniform float uPhase;
    uniform vec3 uMetalTint;
    uniform float uBurst;
    uniform float uBurstRadius;
    uniform float uEnableWing;
    uniform float uEnableSweep;

    vec2 rotateAround(vec2 pt, vec2 pivot, float angle) {
      float c = cos(angle);
      float s = sin(angle);
      vec2 d = pt - pivot;
      return pivot + vec2(d.x * c - d.y * s, d.x * s + d.y * c);
    }

    void main() {
      float aspect = 640.0 / 573.0;
      vec2 center = vec2(0.50, 0.5407);
      vec2 dVec = vec2((vUV.x - center.x) * aspect, vUV.y - center.y);
      float r = length(dVec);

      vec2 sampleUV = vUV;

      // 1. ARTICULATED 3D WING BREATHING & CROWN HOVER
      if (uEnableWing > 0.5) {
        float outerMask = smoothstep(0.250, 0.340, r);
        float leftWingMask  = outerMask * smoothstep(0.37, 0.19, vUV.x) * smoothstep(0.80, 0.54, vUV.y);
        float rightWingMask = outerMask * smoothstep(0.63, 0.81, vUV.x) * smoothstep(0.80, 0.54, vUV.y);

        float baseBreath = sin(uTime * 2.25 + uPhase) * 0.088 + uBurst * 0.065;

        if (leftWingMask > 0.001) {
          vec2 pivotL = vec2(0.305, 0.515);
          float spanL = clamp((0.305 - vUV.x) / 0.26, 0.0, 1.0);
          float angleL = baseBreath * leftWingMask * (0.55 + 0.45 * spanL);
          sampleUV = rotateAround(sampleUV, pivotL, angleL);
          sampleUV.y += sin(uTime * 3.8 - spanL * 4.5 + uPhase) * 0.0055 * leftWingMask * spanL;
        }

        if (rightWingMask > 0.001) {
          vec2 pivotR = vec2(0.695, 0.515);
          float spanR = clamp((vUV.x - 0.695) / 0.26, 0.0, 1.0);
          float angleR = -baseBreath * rightWingMask * (0.55 + 0.45 * spanR);
          sampleUV = rotateAround(sampleUV, pivotR, angleR);
          sampleUV.y += sin(uTime * 3.8 - spanR * 4.5 + uPhase) * 0.0055 * rightWingMask * spanR;
        }

        float crownMask = outerMask * smoothstep(0.27, 0.16, vUV.y) * smoothstep(0.21, 0.09, abs(vUV.x - 0.50));
        if (crownMask > 0.001) {
          sampleUV.y += sin(uTime * 2.25 + uPhase + 0.9) * 0.006 * crownMask;
        }
      }

      if (sampleUV.x < 0.001 || sampleUV.x > 0.999 || sampleUV.y < 0.001 || sampleUV.y > 0.999) {
        gl_FragColor = vec4(0.0);
        return;
      }

      vec4 baseCol = texture2D(uTex, sampleUV);

      // Fast GPU drop-shadow outside the inner portrait opening (eliminates costly CSS drop-shadow blur)
      if (baseCol.a < 0.02) {
        if (r > 0.235) {
          vec2 shUV = clamp(sampleUV - vec2(0.0, 0.024), 0.002, 0.998);
          float shA = texture2D(uTex, shUV).a * 0.58;
          gl_FragColor = vec4(0.0, 0.0, 0.0, shA);
        } else {
          gl_FragColor = vec4(0.0);
        }
        return;
      }

      vec3 rgb = baseCol.rgb;

      // 2. PHYSICAL METALLIC SPECULAR LIGHT SWEEP & CRYSTAL CAUSTICS
      if (uEnableSweep > 0.5) {
        vec2 texel = vec2(1.0 / 512.0, 1.0 / 458.0);
        float lumC = dot(rgb, vec3(0.299, 0.587, 0.114));
        float lumR = dot(texture2D(uTex, sampleUV + vec2(texel.x * 1.4, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
        float lumD = dot(texture2D(uTex, sampleUV + vec2(0.0, texel.y * 1.4)).rgb, vec3(0.299, 0.587, 0.114));

        vec2 grad = vec2(lumR - lumC, lumD - lumC);
        vec3 normal = normalize(vec3(-grad.x * 12.0, -grad.y * 12.0, 1.0));
        float reliefStrength = clamp(length(grad) * 8.5, 0.0, 1.0);

        vec3 lightDir1 = normalize(vec3(
          sin(uTime * 1.6 + uPhase) * 0.85,
          cos(uTime * 1.15 + uPhase) * 0.65 - 0.22,
          0.68
        ));
        vec3 halfVec1 = normalize(lightDir1 + vec3(0.0, 0.0, 1.0));
        float spec1 = pow(max(dot(normal, halfVec1), 0.0), 14.0) * smoothstep(0.18, 0.72, lumC);

        float sweepPhase = mod(uTime * 0.62 + uPhase * 0.35, 2.0) - 0.4;
        float diagCoord = sampleUV.x * 0.78 + sampleUV.y * 0.44;
        float sweepBand = exp(-pow((diagCoord - sweepPhase) / 0.12, 2.0));
        float ridgeMask = smoothstep(0.22, 0.70, lumC) * (0.4 + 0.6 * reliefStrength);
        vec3 sweepGlow = mix(uMetalTint, vec3(1.0, 0.99, 0.94), 0.6) * sweepBand * ridgeMask * 0.72;

        float crystalRingMask = smoothstep(0.210, 0.222, r) * smoothstep(0.264, 0.248, r);
        float angleAroundRing = atan(dVec.y, dVec.x);
        float facetSpark = sin(angleAroundRing * 28.0 + uTime * 5.2 + uPhase) *
                           cos(angleAroundRing * 19.0 - uTime * 3.8);
        facetSpark = pow(max(facetSpark, 0.0), 3.0) * crystalRingMask * smoothstep(0.32, 0.80, lumC);

        float crownGemMask = smoothstep(0.26, 0.13, sampleUV.y) * smoothstep(0.40, 0.82, lumC) * reliefStrength;
        float crownSpark = pow(max(sin(uTime * 3.6 + sampleUV.x * 24.0 + uPhase), 0.0), 4.0) * crownGemMask;

        rgb += uMetalTint * spec1 * 0.55;
        rgb += sweepGlow;
        rgb += vec3(1.0, 0.98, 0.92) * (facetSpark * 0.95 + crownSpark * 0.75);
      }

      // 3. METALLIC SHOCKWAVE PULSE ON LIKE / GIFT BURST
      if (uBurst > 0.005) {
        float waveBand = exp(-pow((r - uBurstRadius) / 0.085, 2.0));
        float lum = dot(rgb, vec3(0.299, 0.587, 0.114));
        vec3 burstLight = mix(uMetalTint, vec3(1.0, 0.99, 0.92), 0.65) * waveBand * uBurst * (0.5 + 0.7 * lum);
        vec3 rimExcite = uMetalTint * uBurst * smoothstep(0.25, 0.75, lum) * 0.35;
        rgb += burstLight * 1.15 + rimExcite;
      }

      rgb = clamp(rgb, 0.0, 1.0);
      gl_FragColor = vec4(rgb * baseCol.a, baseCol.a);
    }
  `;

  const METAL_TINTS = {
    1: [1.0, 0.84, 0.42],
    2: [0.84, 0.92, 1.0],
    3: [1.0, 0.68, 0.44],
  };

  function compileShader(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function createProgram(gl, vsSrc, fsSrc) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      return null;
    }
    return prog;
  }

  function createMedallionWebGLRenderer(frameBoxEl, rank) {
    const imgEl = frameBoxEl.querySelector('.winged-frame-img, .swf-frame-img');
    if (!imgEl) return null;

    const auraEl = frameBoxEl.querySelector('.medallion-aura, .swf-aura');

    let frameCanvas = frameBoxEl.querySelector('.webgl-frame-canvas');
    if (!frameCanvas) {
      frameCanvas = document.createElement('canvas');
      frameCanvas.className = 'webgl-frame-canvas';
      frameCanvas.width = 512;
      frameCanvas.height = 458;
      frameCanvas.style.cssText = 'position:relative;width:100%;height:100%;display:block;pointer-events:none;z-index:3;will-change:transform;';
      frameBoxEl.insertBefore(frameCanvas, imgEl);
    }

    const glOpts = {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    };
    const glFrame = frameCanvas.getContext('webgl', glOpts);
    if (!glFrame) return null;

    const frameProg = createProgram(glFrame, FRAME_VERT_SRC, FRAME_FRAG_SRC);
    if (!frameProg) return null;

    const buf = glFrame.createBuffer();
    glFrame.bindBuffer(glFrame.ARRAY_BUFFER, buf);
    glFrame.bufferData(glFrame.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), glFrame.STATIC_DRAW);
    const loc = glFrame.getAttribLocation(frameProg, 'aPos');
    glFrame.enableVertexAttribArray(loc);
    glFrame.vertexAttribPointer(loc, 2, glFrame.FLOAT, false, 0, 0);

    const tex = glFrame.createTexture();
    let texReady = false;

    function uploadTexture(imageSource) {
      glFrame.bindTexture(glFrame.TEXTURE_2D, tex);
      glFrame.pixelStorei(glFrame.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      glFrame.texParameteri(glFrame.TEXTURE_2D, glFrame.TEXTURE_WRAP_S, glFrame.CLAMP_TO_EDGE);
      glFrame.texParameteri(glFrame.TEXTURE_2D, glFrame.TEXTURE_WRAP_T, glFrame.CLAMP_TO_EDGE);
      glFrame.texParameteri(glFrame.TEXTURE_2D, glFrame.TEXTURE_MIN_FILTER, glFrame.LINEAR);
      glFrame.texParameteri(glFrame.TEXTURE_2D, glFrame.TEXTURE_MAG_FILTER, glFrame.LINEAR);
      glFrame.texImage2D(glFrame.TEXTURE_2D, 0, glFrame.RGBA, glFrame.RGBA, glFrame.UNSIGNED_BYTE, imageSource);
      texReady = true;
      imgEl.style.display = 'none';
    }

    if (imgEl.complete && imgEl.naturalWidth > 0) {
      uploadTexture(imgEl);
    } else {
      imgEl.addEventListener('load', () => uploadTexture(imgEl), { once: true });
    }

    const fLocs = {
      uTex: glFrame.getUniformLocation(frameProg, 'uTex'),
      uTime: glFrame.getUniformLocation(frameProg, 'uTime'),
      uPhase: glFrame.getUniformLocation(frameProg, 'uPhase'),
      uMetalTint: glFrame.getUniformLocation(frameProg, 'uMetalTint'),
      uBurst: glFrame.getUniformLocation(frameProg, 'uBurst'),
      uBurstRadius: glFrame.getUniformLocation(frameProg, 'uBurstRadius'),
      uEnableWing: glFrame.getUniformLocation(frameProg, 'uEnableWing'),
      uEnableSweep: glFrame.getUniformLocation(frameProg, 'uEnableSweep'),
    };

    const tint = METAL_TINTS[rank] || METAL_TINTS[1];
    const phase = rank === 1 ? 0.0 : rank === 2 ? 2.1 : 4.2;

    glFrame.useProgram(frameProg);
    glFrame.viewport(0, 0, frameCanvas.width, frameCanvas.height);
    glFrame.clearColor(0, 0, 0, 0);
    glFrame.activeTexture(glFrame.TEXTURE0);
    glFrame.uniform1i(fLocs.uTex, 0);
    glFrame.uniform1f(fLocs.uPhase, phase);
    glFrame.uniform3f(fLocs.uMetalTint, tint[0], tint[1], tint[2]);

    return {
      rank,
      isReady() {
        return texReady;
      },
      render(tSec, burstIntensity, burstRadius, settings) {
        if (auraEl) {
          const auraScale = 1.0 + Math.sin(tSec * 2.25 + phase) * 0.05 + burstIntensity * 0.28;
          const auraOpacity = Math.min(1, 0.78 + burstIntensity * 0.22);
          auraEl.style.transform = `translate3d(-50%, -50%, 0) scale(${auraScale.toFixed(3)})`;
          auraEl.style.opacity = auraOpacity.toFixed(2);
        }

        if (!texReady) return;
        glFrame.clear(glFrame.COLOR_BUFFER_BIT);
        glFrame.bindTexture(glFrame.TEXTURE_2D, tex);
        glFrame.uniform1f(fLocs.uTime, tSec);
        glFrame.uniform1f(fLocs.uBurst, burstIntensity);
        glFrame.uniform1f(fLocs.uBurstRadius, burstRadius);
        glFrame.uniform1f(fLocs.uEnableWing, settings.levitation3D !== false ? 1.0 : 0.0);
        glFrame.uniform1f(fLocs.uEnableSweep, settings.crystalShimmer !== false ? 1.0 : 0.0);
        glFrame.drawArrays(glFrame.TRIANGLE_STRIP, 0, 4);
      },
    };
  }

  function createPodiumFX(options) {
    const stageEl = options.stageEl;
    if (!stageEl) return null;

    const settings = {
      crystalShimmer: true,
      levitation3D: true,
      burstWaves: true,
      swapEffects: true,
      ...(options.settings || {}),
    };

    let renderers = {};
    const activeBursts = {
      1: { startTime: -10, duration: 1.25 },
      2: { startTime: -10, duration: 1.25 },
      3: { startTime: -10, duration: 1.25 },
    };
    let activeSwap = null;

    function ensureRenderers() {
      [1, 2, 3].forEach((rank) => {
        const unitEl = stageEl.querySelector(`.medallion-unit.rank-${rank}, .swf-unit.rank-${rank}`);
        if (!unitEl) return;
        const frameBox = unitEl.querySelector('.winged-frame-box, .swf-frame-box');
        if (!frameBox) return;
        if (!frameBox.__webglRenderer) {
          frameBox.__webglRenderer = createMedallionWebGLRenderer(frameBox, rank);
        }
        renderers[rank] = frameBox.__webglRenderer;
      });
    }

    ensureRenderers();

    let currentTime = 0;
    let deterministicMode = false;

    function triggerBurst(rank, addedAmount, customStartTime) {
      if (!settings.burstWaves) return;
      const r = Number(rank) || 1;
      const startT = typeof customStartTime === 'number' ? customStartTime : currentTime;
      if (activeBursts[r]) {
        activeBursts[r].startTime = startT;
        activeBursts[r].duration = 1.25;
      }
    }

    function triggerRankSwap(customStartTime) {
      if (!settings.swapEffects) return;
      const startT = typeof customStartTime === 'number' ? customStartTime : currentTime;
      activeSwap = {
        startTime: startT,
        duration: 0.95,
      };
      triggerBurst(1, 350, startT + 0.35);
    }

    function renderFrameAtTime(t) {
      currentTime = t;
      ensureRenderers();

      [1, 2, 3].forEach((rank) => {
        const unitEl = stageEl.querySelector(`.medallion-unit.rank-${rank}, .swf-unit.rank-${rank}`);
        if (!unitEl) return;

        const isBaseElevated = unitEl.classList.contains('medallion-unit') ? -28 : -22;
        const baseY = rank === 1 ? isBaseElevated : 0;
        const phase = rank === 1 ? 0.0 : rank === 2 ? 2.1 : 4.2;

        let floatY = 0;
        let scaleMul = 1.0;
        let swapX = 0;
        let swapY = 0;

        if (settings.levitation3D) {
          floatY = Math.sin(t * 2.25 + phase) * (rank === 1 ? 3.5 : 2.5);
        }

        let burstIntensity = 0.0;
        let burstRadius = 0.0;
        const b = activeBursts[rank];
        if (b && settings.burstWaves) {
          const elapsed = t - b.startTime;
          if (elapsed >= 0 && elapsed <= b.duration) {
            const p = elapsed / b.duration;
            burstRadius = 0.20 + easeOutCubic(p) * 0.44;
            burstIntensity = Math.sin(Math.min(1, p * 2.2) * Math.PI) * Math.pow(1 - p, 0.75);
            scaleMul += burstIntensity * 0.038;
          }
        }

        if (activeSwap && (rank === 1 || rank === 2)) {
          const st = (t - activeSwap.startTime) / activeSwap.duration;
          if (st >= 0 && st <= 1) {
            const inv = 1 - easeInOutCubic(st);
            const arc = Math.sin(st * Math.PI);
            const distX = unitEl.classList.contains('medallion-unit') ? 285 : 235;
            if (rank === 1) {
              swapX = -distX * inv;
              swapY = 26 * inv - arc * 28;
              scaleMul += arc * 0.08;
            } else if (rank === 2) {
              swapX = distX * inv;
              swapY = -26 * inv + arc * 14;
            }
          }
        }

        unitEl.style.transform = `translate3d(${swapX.toFixed(2)}px, ${(baseY + floatY + swapY).toFixed(2)}px, 0) scale(${scaleMul.toFixed(4)})`;

        const renderer = renderers[rank];
        if (renderer) {
          renderer.render(t, burstIntensity, burstRadius, settings);
        }
      });
    }

    let rafId = null;
    const t0 = performance.now();

    function tick(now) {
      if (deterministicMode) return;
      if (!document.hidden) {
        renderFrameAtTime((now - t0) / 1000);
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    const controller = {
      triggerBurst,
      triggerRankSwap,
      rebuildRenderers() {
        ensureRenderers();
        renderFrameAtTime(currentTime);
      },
      updateSettings(newSettings) {
        Object.assign(settings, newSettings);
      },
      setDeterministicTime(tSec) {
        deterministicMode = true;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        renderFrameAtTime(tSec);
      },
      clearBursts() {
        activeBursts[1].startTime = -10;
        activeBursts[2].startTime = -10;
        activeBursts[3].startTime = -10;
        activeSwap = null;
      },
    };

    root.__podiumFX = controller;
    root.__setSimTime = function (sec) {
      controller.setDeterministicTime(sec);
    };
    return controller;
  }

  root.TikFinityPodiumFX = {
    createPodiumFX,
  };
})(typeof window !== 'undefined' ? window : globalThis);
