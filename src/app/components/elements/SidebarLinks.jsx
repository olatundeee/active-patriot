import React from 'react';
import tt from 'counterpart';
import { connect } from 'react-redux';
import { SIGNUP_URL } from 'shared/constants';
import Icon from 'app/components/elements/Icon';
import { Link } from 'react-router';

const SidebarNewUsers = ({ walletUrl }) => {
    const makeLink = (i, ix, arr) => {
        // A link is internal if it begins with a slash
        const isExternal = !i.link.match(/^\//) || i.isExternal;
        // const cn = ix === arr.length - 1 ? '--last' : 'c-sidebar__item';
        if (isExternal) {
            return (
                <li key={ix} className={'c-sidebar__item'}>
                    <a href={i.link} target="_blank" rel="noopener noreferrer">
                        {i.label}&nbsp;<Icon name="extlink" />
                    </a>
                </li>
            );
        }
        if (i.onClick) {
            return (
                <li key={ix} className={cn}>
                    <a onClick={i.onClick}>{i.label}</a>
                </li>
            );
        }
        return (
            <li key={ix} className={cn}>
                <Link to={i.link}>{i.label}</Link>
            </li>
        );
    };

    const links = [
        {
            label: tt('navigation.active_patriot_youtube'),
            link: 'https://www.youtube.com/channel/UCwfIIN1nRLzA-uxqasvRWRQ',
        },
        {
            label: tt('navigation.active_scooter_chase'),
            link: 'https://www.youtube.com/watch?v=eirAX1I488U',
        },
        {
            label: tt('navigation.dover_docks_arrest'),
            link: 'https://www.youtube.com/watch?v=yLeG518OSuM',
        },
        /* {
            label: tt('navigation.steem_engine'),
            link: 'https://steemengine.com/',
        },*/
    ];

    return (
        <div className="c-sidebar__module">
            <div className="c-sidebar__header">
                <h3 className="c-sidebar__h3">Explore Active Patriot</h3>
            </div>
            <div className="c-sidebar__content">
                <ul className="c-sidebar__list">{links.map(makeLink)}</ul>
            </div>
        </div>
    );
};

export default connect((state, ownProps) => {
    const walletUrl = state.app.get('walletUrl');
    return {
        walletUrl,
        ...ownProps,
    };
})(SidebarNewUsers);
