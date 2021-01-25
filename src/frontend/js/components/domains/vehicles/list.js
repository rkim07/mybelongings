import React from 'react';
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../contexts/appcontext';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Image from 'material-ui-image';
import AddIcon from '@material-ui/icons/Add';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import Edit from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Skeleton from '@material-ui/lab/Skeleton';
import Pagination from '@material-ui/lab/Pagination';

const styles = theme => ({
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	cardContent: {
		flexGrow: 1,
	},
	button: {
		margin: theme.spacing(1),
	}
});

function List(props) {
	const {
		classes,
		vehicles,
		onHandleClick,
		onHandleOpenDialog,
		loading
	} = props;

	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Button
					type="button"
					variant="contained"
					color="default"
					className={classes.button}
					startIcon={<AddIcon />}
					onClick={ () => onHandleClick(null, 'add') }
				>
					Add
				</Button>
			</Grid>
			{ (loading ? Array.from(new Array(1)) : vehicles).map((vehicle, index) => (
				<Grid item key={ index } xs={ 12 } sm={ 6 } md={ 4 }>
					<Card className={ classes.card }>
						{ vehicle ? (
							<CardContent className={ classes.cardContent }>
								<Image src={ vehicle.image_path } />
								<Typography gutterBottom variant="h5" component="h4">
									{ vehicle.year } { vehicle.mfrName } { vehicle.model }
								</Typography>
							</CardContent>
						) : (
							<CardContent className={ classes.cardContent }>
								<Skeleton variant="rect" width={210} height={118} />
								<Skeleton width={210} />
							</CardContent>
						)}
						{ vehicle ? (
							<CardActions>
								<IconButton
									aria-label="view"
									color="default"
									className={classes.button}
									onClick={ () => onHandleClick(vehicle, 'view') }
								>
									<DirectionsCar />
								</IconButton>
								<IconButton
									aria-label="update"
									color="default"
									className={classes.button}
									onClick={ () => onHandleClick(vehicle, 'update') }
								>
									<Edit/>
								</IconButton>
								<IconButton
									aria-label="delete"
									color="default"
									className={classes.button}
									onClick={ () => onHandleOpenDialog('delete', vehicle) }
								>
									<DeleteIcon />
								</IconButton>
							</CardActions>
						) : (
							<CardActions>
								<Skeleton width={100} />
							</CardActions>
						)}
					</Card>
				</Grid>
			))}
			<Grid item xs={12}>
				<Pagination count={vehicles.length} variant="outlined" shape="rounded" />
			</Grid>
		</Grid>
	);
}

export default withContext(withStyles(styles)(List));
