//draw-scene.js

let positionXDiff = 0.02
let positionYDiff = 0.02
let positionX = 0;
let positionY = 0;

function drawScene(gl, programInfo, buffers, cubeRotation) {
    positionX += positionXDiff;
    positionY += positionYDiff
    if (positionX >= 8.5 || positionX <= -8.5) {
        positionXDiff *= -1;
    }
    if (positionY >= 3.5 || positionY <= -3.5) {
        positionYDiff *= -1;
    }

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //Clear to black, fully opaque
    gl.clearDepth(1.0); //Clear everything
    gl.enable(gl.DEPTH_TEST); //Enable depth testing
    gl.depthFunc(gl.LEQUAL); //Near things obscure far things

    //Clear the canvas before we start drawing on it
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //Create a perspective matrix, a special matrix this is used
    //to simulate the distortion of perspective in a camera.
    //Our field of view is 45 degrees, with a width / height
    //ratio that matches the display size of the canvas
    //and we only want to see objects between 0.1 units and 100 units away from the camera.
    const fieldOfView = (45 * Math.PI) / 180; //in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    //note: glmatrix.js always has the first argument as the destiation to receive the result
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    
    //Set the drawing position to the "identity" point, which is the center of the scene
    const modelViewMatrix = mat4.create();

    //Now move the drawing position a bit to where we want to start drawing the square
    
    mat4.translate(
        modelViewMatrix, //destination matrix
        modelViewMatrix, //matrix to translate
        [positionX, positionY, -12.0] //amount to translate
    );

    mat4.rotate(
        modelViewMatrix, //destination matrix
        modelViewMatrix, //matrix to rotate
        cubeRotation * 0, //amount to rotate in radians
        [0, 0, 1] //axis to rotate around (Z)
    );
    mat4.rotate(
        modelViewMatrix, //destination matrix
        modelViewMatrix, //matrix to rotate
        cubeRotation * 0.7, //amount to rotate in radians
        [0, 1, 0] //axis to rotate around (Y)
    );
    mat4.rotate(
        modelViewMatrix, //destination matrix
        modelViewMatrix, //matrix to rotate
        cubeRotation * 0.3, //amount to rotate in radians
        [1, 0, 0] //axis to rotate around (X)
    );

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    //Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
    setPositionAttribute(gl, buffers, programInfo);
    
    //Set the colors
    setColorAttribute(gl, buffers, programInfo);
    
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    
    //Set the normal buffers
    setNormalAttribute(gl, buffers, programInfo);
    
    //Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);
    
    //Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );
    
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false, 
        modelViewMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix
    );

    {   
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
} //end drawScene

function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    // Check if the canvas is not the same size.
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;
    
    if (needResize) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    
    return needResize;
} //end resideCanvasToDisplaySize

//Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3; //pull out 3 values per iteration
    const type = gl.FLOAT; //the data in the buffer is 32bit floats
    const normalize = false; //don't normalize
    const stride = 0; //how many bytes to get from one set of values to the next; 0 = use type and numComponents above
    const offset = 0; //how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
} //end setPositionAttribute

//Tell WebGL how to pull out the colors from the color buffer into the vertexColor attribute.
function setColorAttribute(gl, buffers, programInfo) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
} //end setColorAttribute

// Tell WebGL how to pull out the normals from
// the normal buffer into the vertexNormal attribute.
function setNormalAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
} //end setNormalAttribute

export { drawScene };