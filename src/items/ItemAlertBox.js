import { runProgramObject } from "../Program";

export default function ItemAlertBox(item, control) {

    control.showAlertBox(item.is, item.msg, item.interval, item.style);

}



