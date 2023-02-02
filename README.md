# Low-Level-Project
## Project Overview
For my low level project, I decided to work in WebGL so I could better experience the low level operations that are abstracted away in wrappers like three.js. I followed the WebGL tutorial at https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial and then I added a few extra features on top of what the tutorial had me complete. 

## Features
The WebGL tutorial ends with a rotating cube that has a light and a texture. I chose a texture that I think gives the surface depth to enhance the illusion of surface detail. I extended upon the tutorial to make the cube bounce around the sceen. I also made the cube scale itself over time. I also made the WebGL canvas fill the current viewport so it resizes the rendering when the browser window is resized. 

## Running the code
Thanks to the portability of WebGL, my project can be run directly in the web browser. However, there are a few steps to get it up and running. 
1. download the code and images onto your local system
2. open the folder in VSCode
3. right click on index.html in the VSCode file viewer and select "Open with Live Server"
4. This will run the code on localhost and then the web browser will open and the webpage will run

**NOTE:** It needs to be run on localhost in order for WebGL to run.

## What I learned
While I followed the tutorial for the bulk of this implementation, I feel like I now have a better grasp about how WebGL uses the graphics card to render detailed 3D objects. I tried to keep copy and pasting to a minimum so I would get more from writing the code line by line. However, I did compy and past some of it to speed up the process. I feel like I was able to demonstrate my understanding by adding to the functionality of the tutorial and doing so helped me understand some of the inner working of WebGL better. 

## Images
Here are some screenshots from the live demo:
![image](https://user-images.githubusercontent.com/107002749/216467376-8c00896c-4b8e-4b4f-a750-59c275efecec.png)
![image](https://user-images.githubusercontent.com/107002749/216467764-db5ad4fc-37a0-44df-ad78-db37d097eb3b.png)
![image](https://user-images.githubusercontent.com/107002749/216467843-de1ac14a-24d1-4c7b-ad18-983d508be6db.png)
