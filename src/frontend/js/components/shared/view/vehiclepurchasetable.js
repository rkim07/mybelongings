import React from 'react';
import * as _ from 'lodash';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Link from '@material-ui/core/Link';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles, withStyles } from '@material-ui/core/styles';

// Table cell CSS
const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	body: {
		backgroundColor: '#FFFFF',
	},
}))(TableCell);

const useStyles = makeStyles((theme) => ({
	table: {
		width: 500,
	},
	button: {
		background: '#404040',
		color: 'white',
		height: 36,
		margin: theme.spacing(3, 0, 2)
	}
}));

export default function VehiclePurchaseTable(props) {
	const classes = useStyles();
	const {
		tableCells,
		model,
		loading
	} = props;

	// Pick only objects that will be viewed on table cells
	const pickedObjs = _.pick(model, (_.keys(tableCells)));

	return (
		<TableContainer>
			<Table className={ classes.table }>
				<TableBody>
					{( loading ? Array.from(new Array(10)) : _.entries(pickedObjs)).map((idx, index) => (
						idx ? (
							<TableRow key={ index }>
								<StyledTableCell component='th' scope='row'>
									{ tableCells[idx[0]] }
								</StyledTableCell>
								<StyledTableCell align='right'>
									{(() => {
										switch (idx[0]) {
											case 'deposit':
											case 'downPayment':
											case 'msrpPrice':
											case 'stickerPrice':
											case 'purchasePrice':
												return `$${idx[1]}`
											case 'agreement':
												return (
													<Link
														href={ model.filePath }
														download
													>
														Download Purchase Agreement
													</Link>
												)
											default:
												return idx[1];
										}
									})()}
								</StyledTableCell>
							</TableRow>
						):(
							<TableRow key={ index }>
								<StyledTableCell component='th' scope='row'>
									<Skeleton/>
								</StyledTableCell>
								<StyledTableCell align='right'>
									<Skeleton/>
								</StyledTableCell>
							</TableRow>
						)
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
