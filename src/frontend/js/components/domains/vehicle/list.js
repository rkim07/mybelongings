import React from 'react';
import { Link } from 'react-router-dom';
import { getImageSource } from '../../../helpers/images';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Image from 'material-ui-image';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

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
	const classes = useStyles();
	const {
		loading,
		vehicles,
	} = props;

	return (
		<Container component='main' maxWidth='md'>
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
								</CardActions>
							) : (
								<CardActions>
									<Skeleton width={100} />
								</CardActions>
							)}
						</Card>
					</Grid>
				))}
			</Grid>
		</Container>
	);
}
