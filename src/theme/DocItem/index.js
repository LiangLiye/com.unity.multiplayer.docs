/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Head from '@docusaurus/Head';
import { useTitleFormatter } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocPaginator from '@theme/DocPaginator';
import DocVersionSuggestions from '@theme/DocVersionSuggestions';
import TOC from '@theme/TOC';
import IconEdit from '@theme/IconEdit';
import IconBug from '@theme/IconBug';
import clsx from 'clsx';
import styles from './styles.module.css';
import { useActivePlugin, useVersions, useActiveVersion } from '@theme/hooks/useDocs';
import Link from '@docusaurus/Link';

//Components
//import ShareButton from '../../components/DocItem/ShareButton';

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons'

function DocItem(props) {
  const {
    siteConfig
  } = useDocusaurusContext();
  const {
    url: siteUrl
  } = siteConfig;
  const {
    content: DocContent
  } = props;
  const {
    metadata,
    frontMatter: {
      image: metaImage,
      keywords,
      hide_title: hideTitle,
      hide_table_of_contents: hideTableOfContents
    }
  } = DocContent;
  const {
    description,
    title,
    permalink,
    editUrl,
    lastUpdatedAt,
    lastUpdatedBy
  } = metadata;
  const {
    pluginId
  } = useActivePlugin({
    failfast: true
  });
  const versions = useVersions(pluginId);
  const version = useActiveVersion(pluginId); // If site is not versioned or only one version is included
  // we don't show the version badge
  // See https://github.com/facebook/docusaurus/issues/3362

  const showVersionBadge = versions.length > 1;
  const metaTitle = useTitleFormatter(title);
  const metaImageUrl = useBaseUrl(metaImage, {
    absolute: true
  });
  // grabs the markdown file location for submitting GitHub issues
  const mdPath = editUrl.substring(76, );

  return <>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        {description && <meta name="description" content={description} />}
        {description && <meta property="og:description" content={description} />}
        {keywords && keywords.length && <meta name="keywords" content={keywords.join(',')} />}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta name="twitter:image" content={metaImageUrl} />}
        {metaImage && <meta name="twitter:image:alt" content={`Image for ${title}`} />}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
        {permalink && <link rel="canonical" href={siteUrl + permalink} />}
      </Head>

      <div className="row">
        <div className={clsx('col', {
        [styles.docItemCol]: !hideTableOfContents
      })}>
          <DocVersionSuggestions />
          <div className={styles.docItemContainer}>
            <article>
              
              {!hideTitle && <header>
                  <h1 className={styles.docTitle}>{title}</h1>
                </header>}
                
              <div className="row margin-left--none navbar__inner liner">

                {/* Open Doc Button*/}
                {showVersionBadge && <div>
                  <Link to={useBaseUrl ('/reference/version-matrix') } target='_blank'><span className="badge badge--secondary">
                    Version: {version.label}
                  </span></Link>
                </div>}

                <div className="user-options">
                  {/* PDF Button*/}
                  <div className="margin-right--md pointer display-flex" style={{ display: 'flex' }}>
                    {editUrl && <a onClick={()=>window.print()}> {/* href={openIssueURL} target="_blank" rel="noreferrer noopener"*/}
                      <FontAwesomeIcon icon={ faPrint } /><>&nbsp;</>
                        PDF
                      </a>}
                  </div>

                  {/* Edit URL */}
                  <div>
                    {editUrl && <a href={editUrl} target="_blank" rel="noreferrer noopener">
                        <IconEdit />
                        Edit this page
                      </a>}
                      <>&nbsp;&nbsp;&nbsp;</>
                  </div>

                {/* Open Doc Button*/}
                <div className="margin-right--md display-flex" style={{ display: 'flex' }}>
                {mdPath && <a href={'https://github.com/Unity-Technologies/com.unity.multiplayer.docs/issues/new?labels=feedback&title=Feedback%20for%20' + mdPath }  target="_blank">
                    <IconBug />
                    Log an issue</a>} 
                </div>
  
                </div>  
                </div> 


              <div className="markdown">
                <DocContent />
              </div>
            </article>
            {(editUrl || lastUpdatedAt || lastUpdatedBy) && <div className="margin-vert--xl">
                <div className="row">                  
                  {(lastUpdatedAt || lastUpdatedBy) && <div className="col feedback-update">
                      <em>
                        <small>
                          Last updated{' '}
                          {lastUpdatedAt && <>
                              on{' '}
                              <time dateTime={new Date(lastUpdatedAt * 1000).toISOString()} className={styles.docLastUpdatedAt}>
                                {new Date(lastUpdatedAt * 1000).toLocaleDateString()}
                              </time>
                              {lastUpdatedBy && ' '}
                            </>}
                          {lastUpdatedBy && <>
                              by <strong>{lastUpdatedBy}</strong>
                            </>}
                          {process.env.NODE_ENV === 'development' && <div>
                              <small>
                                {' '}
                                (Simulated during dev for better perf)
                              </small>
                            </div>}
                        </small>
                      </em>
                    </div>}
                    </div>
              </div>}
            <div className="margin-vert--lg">
              <DocPaginator metadata={metadata} />
            </div>
          </div>
        </div>
        {!hideTableOfContents && DocContent.toc && <div className="col col--3">
            <TOC toc={DocContent.toc} />
          </div>}
      </div>
    </>;
}

export default DocItem;