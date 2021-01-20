import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Image from "material-ui-image";
import AddIcon from '@material-ui/icons/Add';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import Edit from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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
		user,
		onHandleClick,
		onHandleDelete,
		getVehiclesByUserKey
	} = props;

	const [vehicles, setVehicles] = useState('');

	useEffect(() => {
		getVehiclesByUserKey(user.userKey).then(response => {
			setVehicles(response.data.vehicles);
		});

		return () => setVehicles('');
	}, []);

	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Button
					type="button"
					variant="contained"
					color="default"
					className={classes.button}
					startIcon={<AddIcon />}
					onClick={ () => onHandleClick(null, 'new') }
				>
					Add New
				</Button>
			</Grid>
			{ vehicles &&
				vehicles.map((vehicle) => (
					<Grid item key={ vehicle.key } xs={ 12 } sm={ 6 } md={ 4 }>
						<Card className={ classes.card }>
							<CardContent className={ classes.cardContent }>
								<Image src={ vehicle.image_path } />
								<Typography gutterBottom variant="h5" component="h4">
									{ vehicle.year } { vehicle.mfrName } { vehicle.model }
								</Typography>
							</CardContent>
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
									onClick={ () => onHandleDelete(vehicle.key) }
								>
									<DeleteIcon />
								</IconButton>
							</CardActions>
						</Card>
					</Grid>
				))
			}
		</Grid>
	);
}

List.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withContext(withStyles(styles)(List));
