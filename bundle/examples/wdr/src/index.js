const wdrLoader = require("wdr-loader");

wdrLoader(data=> {
    render(data);
})

function render(data) {
    document.title = 'WDR example';
    loadScript("/dist/evaluatly.js", () => Evaluatly.loadVar(template(data)));
}

function template(data) {

    return (
    {
        "hash": "example/wdr",
        "story": {
            "env": {
                "back_label": "Back"
            },
            "pages": [
                    {
                        "items": [
                            { "type": "question", "value": data.title},
                            { "type": "radio", "save_key": "fruit", "required": true,
                                "options": data.options.map(item => ({ "label": item }))
                            }
                        ],
                        "submit" : { "label": "Next", "program": {"next_page": true} }
                    },
                    {
                        "items": [
                            { "type": "title", "value": "{{fruit.label}} is awesome!" }
                        ]
                    }
                ]
        },
        "theme": {
            "page": {
                "font-family": "google:Lato",
                "font-size": "20px",
                "color": "#4b3f32",
                "background-color": "#f5f1ed"
            },
            "content": {
                "align-items": "center",
                "text-align": "center",
                "justify-content": "center"
            },
            "title": {
                "color" : "#000000"
            },
            "subtitle": {
                "color" : "#000000"
            },
            "question": {
                "color" : "#000000"
            },
            "button": {
                "background-color": "#f1574b",
                "color": "#ffffff",
                "border-radius" : "100px",
                "border-width" : "3px"
            },
            "button:hover": {
                "background-color": "#ffffff",
                "color": "#f1574b"
            },
            "link": {
                "color": "#f1574b"
            },
            "form_submit.inputs": {
                "background-color": "#fff"
            },
            "form_submit .input": {
                "color": "#000"
            },
            "form .option:hover": {
                "color": "#3e306e"
            },
            "form_submit .option:hover": {
                "color": "#3e306e"
            }
        }
    });

}

function loadScript(url, onload) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    document.head.appendChild(script);
    script.onload = onload;
    script.src = url;
}
