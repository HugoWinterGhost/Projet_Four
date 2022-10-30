<?php
namespace App\Tests\Api\entity\main;

use App\Entity\Main\Impact;
use App\Entity\Main\Event;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use App\Tests\ApiAuthenticationTest;

/**
 * Class EventTest
 * @package Event
 */
class EventTest extends ApiAuthenticationTest
{
    use RefreshDatabaseTrait;

    /**
     * Test Get Collection of Event
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
        $response = $this->createClientWithCredentials()->request('GET', '/events');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/Event',
            '@id' => '/events',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 20,
        ]);

        $this->assertCount(20, $response->toArray()['hydra:member']);
    }

    /**
     * Test create Event
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testCreateEvent(): void
    {

        $this->createClientWithCredentials()->request('POST', '/events', [
            'json' => [
                "title" => "test",
            ]
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Event',
            '@type' => 'Event',
            "title" => "test",
        ]);
    }

    /**
     * Test creating an invalid event
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testCreateInvalidEvent(): void
    {
        $this->createClientWithCredentials()->request('POST', '/events', [
            'json' => []
        ]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'title: This value should not be blank.',
        ]);
    }

    /**
     * Test if update a event
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testUpdateEvent(): void
    {
        $iri = $this->findIriBy(Event::class, ['title' => 'event_1']);

        $this->createClientWithCredentials()->request('PATCH', $iri, [
            'json' => [ 'title' => 'test'],
            "headers" => [
                "Content-Type" => "application/merge-patch+json"
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'title' => 'test',
        ]);
    }

    /**
     * Test if delete business.
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testDeleteEvent(): void
    {
        $iri = $this->findIriBy(Event::class, ['title' => 'event_1']);

        $this->createClientWithCredentials()->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            $this->getContainer()->get('doctrine')->getRepository(Event::class)->findOneBy(['title' => 'event_1'])
        );
    }
}
