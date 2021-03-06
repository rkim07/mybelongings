import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
import List from './list';
import View from './view';
import Container from '@material-ui/core/Container';

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	cardGrid: {
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
	}
});

class Dashboard extends React.Component
{
	/**
	 * Constructor
	 *
	 * @param props
	 */
	constructor(props) {
		super(props);

		this.state = {
			mode: 'list',
			property: {}
		}

		this.onHandleClick = this.onHandleClick.bind(this);
	}

	/**
	 * After component is mounted
	 */
	componentDidMount() {
		this.props.getUserProperties();
	}

	/**
	 * Handle buttons click
	 * @param property
	 * @param mode
	 */
	onHandleClick = (property, mode) => {
		this.setState({
			mode: mode,
			property: property
		})
	}

	/**
	 * Render
	 *
	 * @returns {*}
	 */
	render() {
		const { classes } = this.props;

		return (
			<Container className={classes.cardGrid} maxWidth="md">
				{
					{
						'list': <List onHandleClick={ this.onHandleClick }/>,
						'view': <View property={ this.state.property }/>
					}[this.state.mode]
				}
			</Container>
		)
	}
}

export default withContext(withStyles(styles)(Dashboard));
