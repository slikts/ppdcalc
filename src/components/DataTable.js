import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import style from "./DataTable.module.scss";
import InfoIcon from "@material-ui/icons/Info";
import { useHighlight } from "../hooks";

const Value = React.memo(({ children: value }) => {
  const ref = useHighlight(value);
  return (
    <div ref={ref} className={style.number}>
      {value}
    </div>
  );
});

const DataTable = ({ data }) => {
  return (
    <div className={style.DataTable}>
      <Paper>
        <Table>
          <TableBody>
            {Object.values(data).map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>
                  <InfoIcon />
                </TableCell>
                <TableCell align="right">
                  <Value>{row.value}</Value>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default React.memo(DataTable);
