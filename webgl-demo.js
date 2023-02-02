//webgl-demo.js
import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

let cubeRotation = 0.0;
let deltaTime = 0;

main();

function main() {
    const canvas = document.querySelector("#glcanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    //Only continue if WebGl is availiable and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it");
        return;
    } //end if

    //Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec4 aVertexColor;

        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;
        varying highp vec3 vLighting;

        void main(void){
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aVertexColor;

            //Apply lighting effect

            highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
            highp vec3 directionalLightColor = vec3(1, 1, 1);
            highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
        }
    `;

    //Fragment shader program
    const fsSource = `
        varying lowp vec4 vColor;
        varying highp vec3 vLighting;

        void main(void){
            gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
        }
    `;

    //Intialize a shader program
    //This is where all the lighting for the vertices and so forth is established.
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    //Collect all the info needed to use the shader program.
    //Look up which attribute our shader program us using
    //for aVertexPosition and look up uniform locations.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPositions: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
        },
    };

    //Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    //Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Here's where we call the routine that builds all the objects we'll be drawing
    const buffers = initBuffers(gl);
    
    //Draw the scene repeatedly
    let then = 0;
    function render(now) {
        now *= 0.001; //convert to seconds
        deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, cubeRotation);
        cubeRotation += deltaTime;

        requestAnimationFrame(render);
    } //end render
    requestAnimationFrame(render);
} //end main

//Initialize a shader program, so WebGl knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    //Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    //If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    } //end if
    return shaderProgram;
} //end initShaderProgram

//Creates a shader of the given type, uploads the source and compiles it
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    //Send the source to the shader object
    gl.shaderSource(shader, source);

    //Compile the shader program
    gl.compileShader(shader);

    //See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occured compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    } //end if

    return shader;
} //end loadShader