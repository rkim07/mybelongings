import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../../appcontext';
import Dialogger from '../../shared/feedback/dialogger';
import { getImageSource } from '../../shared/helpers/images';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Image from 'material-ui-image';
import DirectionsCarTwoToneIcon from '@material-ui/icons/DirectionsCarTwoTone';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import Edit from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import {DirectionsCarTwoTone} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 400,
	},
	cardContent: {
		flexGrow: 1,
	},
	button: {
		background: '#404040',
		color: 'white',
		height: 36,
		margin: theme.spacing(3, 0, 2)
	}
}));

/**
 * Child component of dashboard
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function List(props) {
	const dialoggerRef = useRef();
	const classes = useStyles();
	const {
		loading,
		vehicles,
		onHandleDelete // parent call
	} = props;

	return (
		<Container component='main' maxWidth='md'>
			<Grid container justify='flex-end'>
				<Grid item>
					<Button
						size='small'
						type='button'
						variant='contained'
						color='default'
						className={classes.button}
						startIcon={<DirectionsCarTwoToneIcon />}
						component={Link}
						to={ '/vehicles/create' }
					>
						Add new vehicle
					</Button>
				</Grid>
			</Grid>
			<Grid container spacing={4}>
				{ ( loading ? Array.from(new Array(1)) : vehicles).map((vehicle, index) => (
					<Grid item key={ index } xs={ 12 } sm={ 6 } md={ 4 }>
						<Card className={ classes.card }>
							{ vehicle ? (
								<CardContent className={ classes.cardContent }>
									<Image src={ getImageSource(vehicle.image, vehicle.imagePath, 'vehicle') } />
									<Typography gutterBottom variant='h5' component='h4'>
										{ vehicle.year } { vehicle.mfrName } { vehicle.model }
									</Typography>
								</CardContent>
							) : (
								<CardContent className={ classes.cardContent }>
									<Skeleton variant='rect' width={210} height={118} />
									<Skeleton width={210} />
								</CardContent>
							)}
							{ vehicle ? (
								<CardActions>
									<IconButton
										aria-label='view'
										color='default'
										component={Link}
										to={ `/vehicles/information/${vehicle.key}` }
									>
										<DirectionsCar />
									</IconButton>
									<IconButton
										aria-label='update'
										color='default'
										component={Link}
										to={ `/vehicles/edit/${vehicle.key}` }
									>
										<Edit/>
									</IconButton>
									<IconButton
										aria-label='delete'
										color='default'
										onClick={ () => dialoggerRef.current.openDialogger('delete', { vehicleKey: vehicle.key }) }
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
				<Dialogger
					ref={ dialoggerRef }
					{...props}
				/>
			</Grid>
		</Container>
	);
}
