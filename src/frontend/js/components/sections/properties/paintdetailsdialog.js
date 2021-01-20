import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';

const styles = (theme, props) => ({
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	}
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
	},
}))(MuiDialogContent);

function PaintDetailsDialog(props) {
	const { classes, paint, open, onHandleClose, areaName } = props;

	return (
		<Dialog onClose={ onHandleClose } aria-labelledby="customized-dialog-title" open={open}>
			<DialogTitle id="customized-dialog-title" onClose={ onHandleClose }>
				{ _.startCase(areaName) } Paint
			</DialogTitle>
			<DialogContent dividers>
				<Card className={classes.root}>
					<CardMedia
						component="img"
						alt="Paint Details"
						height="140"
						image={ paint.image_path }
						title="Paint Details"
					/>
					<CardContent>
						<Typography variant="body2" color="textSecondary" component="p">
							{ _.startCase(paint.name) }
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p">
							{ _.startCase(paint.usage) }
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p">
							{ _.startCase(paint.color) }
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p">
							{ paint.hex }
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p">
							{ paint.rgb }
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p">
							{ paint.lrv }
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p">
							{ paint.barcode }
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p">
							Notes: { paint.notes }
						</Typography>
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	);
}

PaintDetailsDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withContext(withStyles(styles)(PaintDetailsDialog));
