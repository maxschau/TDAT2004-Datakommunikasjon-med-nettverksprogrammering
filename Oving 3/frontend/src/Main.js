import React, {Component} from 'react';
import Service from "./Service";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code : "",
            build1 : "",
            answer :"",
            code1: ""
        }
    }

    runCode() {
        //let msg = document.getElementById("input").value;
        let service = new Service();
        service.sendCode(this.state.code)
            .then((res) => {
               console.log(res.data);
               this.setState({
                   build1 : res.data[0],
                   answer : res.data[1]
               })
            })
            .catch((err) => {
                console.error(err);
            })

    }

    render() {
        return (
            <div id={"container"}>
                <div className={"row"}>
                    <div className={"col"}>
                        <h1>Øving 3</h1>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                        <h6>main.cpp:</h6>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                        <Editor
                            value={this.state.code}
                            onValueChange={code => this.setState({ code })}
                            highlight={code => highlight(code, languages.c++)}
                            padding={20}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 15,
                                backgroundColor: "beige",
                                height: "300px",
                                border: "1px solid black"
                            }}
                        />
                    </div>
                </div>
                {/*<div className={"row"}>
                    <div className={"col"}>
                        <textarea id={"input"} rows={"16"} cols={"50"}/>
                    </div>
                </div>*/}
                <div className={"row"}>
                    <div className={"col"}>
                        <button onClick={() => this.runCode()} id={"btnInput"} className={"btn btn-outline-dark"}>Compile and Run</button>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                        <h5>Compiled code:</h5>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                        {this.state.build1.split("\n").map((paragraph, i) => {
                            return(
                                <p key={i}>{paragraph} </p>
                            )
                        })}

                        {this.state.answer.split("\n").map((paragraph, i) => {
                            return(
                                <p key={i}>{paragraph} </p>
                            )
                        })}

                    </div>
                </div>



            </div>

        )
    }
}

export default Main;