//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Sokoban.js                                                    //
//  Project   : js_demos                                                      //
//  Date      : Aug 15, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Just a simple sokoban game...                                            //
//---------------------------------------------------------------------------~//


//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const INPUT_METHOD_INVALID  = -1;
const INPUT_METHOD_KEYBOARD =  0;
const INPUT_METHOD_MOUSE    =  1;

//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let resourcesLoaded = false;
let drawFunc        = null;
let keyDownFunc     = null;
let keyUpFunc       = null;
let mouseClickFunc  = null;
let inputMethod     = INPUT_METHOD_INVALID;
let is_first_click  = true;


//----------------------------------------------------------------------------//
// Helper Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
async function
LoadFont(fontFace, path)
{
    let font_face = new FontFace(
        fontFace,
        "url(" + path + ")"
    );
    console.log("before await");
    await font_face.load();
    document.fonts.add(font_face);
    console.log("after await");
}

//------------------------------------------------------------------------------
function ChangeStateToSplash()
{
    inputMethod = INPUT_METHOD_INVALID;

    drawFunc       = StateSplash_Draw;
    keyDownFunc    = StateSplash_KeyDown;
    keyUpFunc      = null;
    mouseClickFunc = StateSplash_MouseClick;

    StateSplash_Setup();
}

//------------------------------------------------------------------------------
function ChangeStateToGame()
{
    drawFunc       = StateGame_Draw;
    keyDownFunc    = StateGame_KeyDown;
    keyUpFunc      = StateGame_KeyUp;
    mouseClickFunc = null;

    StateGame_Setup();
}

//------------------------------------------------------------------------------
function ChangeStateToGameOver()
{
    drawFunc       = StateGameOver_Draw;
    keyDownFunc    = StateGameOver_KeyDown;
    keyUpFunc      = null;
    mouseClickFunc = StateGameOver_MouseClick;

    StateGameOver_Setup();
}

//------------------------------------------------------------------------------
function InitializeCanvas()
{
    //
    // Configure the Canvas.
    const parent        = document.getElementById("canvas_div");
    const parent_width  = parent.clientWidth;
    const parent_height = parent.clientHeight;

    const max_side = Math_Max(parent_width, parent_height);
    const min_side = Math_Min(parent_width, parent_height);

    const ratio = min_side / max_side;

    // Landscape
    if(parent_width > parent_height) {
        Canvas_CreateCanvas(800, 800 * ratio, parent);
    }
    // Portrait
    else {
        Canvas_CreateCanvas(800 * ratio, 800, parent);
    }

    Canvas.style.width  = "100%";
    Canvas.style.height = "100%";
}


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
async function Setup()
{
    Random_Seed(null);
    InitializeCanvas();
    Input_InstallBasicMouseHandler   (Canvas);
    Input_InstallBasicKeyboardHandler();

    await LoadFont("vector_battleregular", "./res/vectorb-webfont.woff");
    resourcesLoaded = true;

    ChangeStateToSplash();
    Canvas_Start();
}

//------------------------------------------------------------------------------
function Draw(dt)
{
    if(resourcesLoaded && drawFunc != null) {
        drawFunc(dt);
    }
    Mouse_IsClicked = false;
}


//----------------------------------------------------------------------------//
// Input                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function OnKeyDown(event)
{
    const code = event.keyCode;
    if(keyDownFunc != null) {
        keyDownFunc(code);
    }
}

function OnKeyUp(event)
{
    const code = event.keyCode;
    if(keyUpFunc != null) {
        keyUpFunc(code);
    }
}


//------------------------------------------------------------------------------
function OnMouseClick()
{
    if(is_first_click) {
        is_first_click = false;
        return;
    }
    if(mouseClickFunc != null) {
        mouseClickFunc();
    }
}


//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
Setup();