<?php
namespace App\Tests\Api\entity\ecommerce;

use App\Entity\Ecommerce\Collection;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use App\Tests\ApiAuthenticationTest;

/**
 * Class CollectionTest
 * @package Collection
 */
class CollectionTest extends ApiAuthenticationTest
{
    use RefreshDatabaseTrait;

    /**
     * Test Get Collection of Collection
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testGetCollection(): void
    {
        $response = $this->createClientWithCredentials()->request('GET', '/collections');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/Collection',
            '@id' => '/collections',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 10,
        ]);

        $this->assertCount(10, $response->toArray()['hydra:member']);

        $this->assertMatchesResourceCollectionJsonSchema(Collection::class);
    }

    /**
     * Test create Collection
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testCreateCollection(): void
    {
        $this->createClientWithCredentials()->request('POST', '/collections', [
            'json' => [
                "name" => "test",
            ]
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Collection',
            '@type' => 'Collection',
            "name" => "test",
        ]);
        $this->assertMatchesResourceItemJsonSchema(Collection::class);
    }

    /**
     * Test creating an invalid collection
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testCreateInvalidCollection(): void
    {
        $this->createClientWithCredentials()->request('POST', '/collections', [
            'json' => []
        ]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value should not be blank.',
        ]);
    }

    /**
     * Test if update a collection
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testUpdateCollection(): void
    {
        $iri = $this->findIriBy(Collection::class, ['name' => 'collection_1']);

        $this->createClientWithCredentials()->request('PATCH', $iri, [
            'json' => [ 'name' => 'test'],
            "headers" => [
                "Content-Type" => "application/merge-patch+json"
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'name' => 'test',
        ]);
    }

    /**
     * Test if delete business.
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testDeleteCollection(): void
    {
        $iri = $this->findIriBy(Collection::class, ['name' => 'collection_1']);

        $this->createClientWithCredentials()->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            $this->getContainer()->get('doctrine')->getRepository(Collection::class)->findOneBy(['name' => 'collection_1'])
        );
    }
}
